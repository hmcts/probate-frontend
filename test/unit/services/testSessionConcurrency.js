'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const SessionConcurrency = require('app/services/SessionConcurrency');
const SessionOwnershipStatusEnum = require('app/utils/SessionOwnershipStatusEnum');

describe('SessionConcurrency service', () => {
    const userId = 'immutable-idam-user-id';
    const redisKey = `session:active:user:${userId}`;
    const createSessionStore = (redisClient, destroy) => {
        return {
            client: {
                get: sinon.stub(),
                set: sinon.stub(),
                del: sinon.stub()
            },
            redisClient,
            destroy: destroy || sinon.stub().callsFake((sessionId, callback) => callback())
        };
    };

    it('makes callback activation authoritative before destroying the previous session', async () => {
        const newlyAuthenticatedSessionId = 'new-session-id';
        const state = {};
        const redisClient = {
            eval: sinon.stub().callsFake((script, keyCount, key, newOwnerSessionId) => {
                const previous = state[key] || null;
                state[key] = newOwnerSessionId;
                return Promise.resolve(previous);
            })
        };
        const sessionStore = createSessionStore(
            redisClient,
            sinon.stub().callsFake((sessionId, callback) => {
                expect(state[redisKey]).to.equal(newlyAuthenticatedSessionId);
                callback();
            })
        );
        const sessionConcurrency = new SessionConcurrency({singleActiveSessionEnabled: true, redisEnabled: true, mappingTtl: 300});
        state[redisKey] = 'old-session-id';

        const result = await sessionConcurrency.activateLatestSession(sessionStore, userId, newlyAuthenticatedSessionId);

        sinon.assert.calledOnce(redisClient.eval);
        expect(result.previousSessionId).to.equal('old-session-id');
        expect(result.ownershipStatus).to.equal(SessionOwnershipStatusEnum.getCurrent());
        sinon.assert.calledWith(sessionStore.destroy, 'old-session-id');
        expect(state[redisKey]).to.equal(newlyAuthenticatedSessionId);
    });

    it('preserves the new mapping when previous-session destruction fails', async () => {
        const newlyAuthenticatedSessionId = 'new-session-id';
        const state = {};
        const redisClient = {
            eval: sinon.stub().callsFake((script, keyCount, key, newOwnerSessionId) => {
                const previous = state[key] || null;
                state[key] = newOwnerSessionId;
                return Promise.resolve(previous);
            })
        };
        const destroyError = new Error('destroy failed');
        const sessionStore = createSessionStore(
            redisClient,
            sinon.stub().callsFake((sessionId, callback) => callback(destroyError))
        );
        const sessionConcurrency = new SessionConcurrency({singleActiveSessionEnabled: true, redisEnabled: true, mappingTtl: 300});
        state[redisKey] = 'old-session-id';

        const result = await sessionConcurrency.activateLatestSession(sessionStore, userId, newlyAuthenticatedSessionId);

        expect(result.previousSessionId).to.equal('old-session-id');
        expect(result.ownershipStatus).to.equal(SessionOwnershipStatusEnum.getCurrent());
        expect(result.destroyError).to.equal(destroyError);
        expect(state[redisKey]).to.equal(newlyAuthenticatedSessionId);
    });

    it('rejects a stale protected request without allowing it to overwrite the owner', async () => {
        const state = {[redisKey]: 'new-session-id'};
        const redisClient = {
            eval: sinon.stub().callsFake((script, keyCount, key, requestSessionId) => {
                if (state[key] === requestSessionId) {
                    state[key] = requestSessionId;
                    return Promise.resolve(1);
                }
                return Promise.resolve(0);
            })
        };
        const sessionConcurrency = new SessionConcurrency({singleActiveSessionEnabled: true, redisEnabled: true});

        const ownershipStatus = await sessionConcurrency.validateCurrentOwnerAndRefreshTtl(createSessionStore(redisClient), userId, 'old-session-id');

        sinon.assert.calledOnce(redisClient.eval);
        expect(ownershipStatus).to.equal(SessionOwnershipStatusEnum.getSuperseded());
        expect(state[redisKey]).to.equal('new-session-id');
    });

    it('returns unverifiable when owner mapping is missing after another browser clears it', async () => {
        const browserASessionId = 'session-A';
        const browserBSessionId = 'session-B';
        const state = {[redisKey]: browserBSessionId};
        const redisClient = {
            eval: sinon.stub().callsFake((script, keyCount, key, requestSessionId) => {
                if (script.includes('DEL') && state[key] === requestSessionId) {
                    delete state[key];
                    return Promise.resolve(1);
                }
                if (state[key] === requestSessionId) {
                    return Promise.resolve(1);
                }
                if (!state[key]) {
                    return Promise.resolve(2);
                }
                return Promise.resolve(0);
            })
        };
        const sessionConcurrency = new SessionConcurrency({singleActiveSessionEnabled: true, redisEnabled: true});
        const sessionStore = createSessionStore(redisClient);
        const browserBClearResult = await sessionConcurrency.clearCurrentOwnerMappingOnSessionMatch(sessionStore, userId, browserBSessionId);
        const browserAValidationResult = await sessionConcurrency.validateCurrentOwnerAndRefreshTtl(sessionStore, userId, browserASessionId);

        sinon.assert.calledTwice(redisClient.eval);
        expect(browserBClearResult).to.equal(1);
        expect(browserAValidationResult).to.equal(SessionOwnershipStatusEnum.getUnverifiable());
        expect(state[redisKey]).to.equal(undefined);
    });

    it('refreshes TTL only for the current owner', async () => {
        const state = {[redisKey]: 'session-A'};
        const touches = [];
        const redisClient = {
            eval: sinon.stub().callsFake((script, keyCount, key, requestSessionId, ttl) => {
                if (state[key] === requestSessionId) {
                    touches.push({requestSessionId, ttl});
                    return Promise.resolve(1);
                }
                return Promise.resolve(0);
            })
        };
        const sessionConcurrency = new SessionConcurrency({singleActiveSessionEnabled: true, redisEnabled: true, mappingTtl: 600});

        const sessionStore = createSessionStore(redisClient);
        const ownerResult = await sessionConcurrency.validateCurrentOwnerAndRefreshTtl(sessionStore, userId, 'session-A');
        const staleResult = await sessionConcurrency.validateCurrentOwnerAndRefreshTtl(sessionStore, userId, 'session-B');

        sinon.assert.calledTwice(redisClient.eval);
        expect(ownerResult).to.equal(SessionOwnershipStatusEnum.getCurrent());
        expect(staleResult).to.equal(SessionOwnershipStatusEnum.getSuperseded());
        expect(touches).to.deep.equal([{requestSessionId: 'session-A', ttl: 600}]);
    });

    it('conditionally clears only the matching owner', async () => {
        const state = {[redisKey]: 'session-A'};
        const redisClient = {
            eval: sinon.stub().callsFake((script, keyCount, key, requestSessionId) => {
                if (state[key] === requestSessionId) {
                    delete state[key];
                    return Promise.resolve(1);
                }
                return Promise.resolve(0);
            })
        };
        const sessionConcurrency = new SessionConcurrency({singleActiveSessionEnabled: true, redisEnabled: true});

        const sessionStore = createSessionStore(redisClient);
        const staleClear = await sessionConcurrency.clearCurrentOwnerMappingOnSessionMatch(sessionStore, userId, 'session-B');
        const ownerClear = await sessionConcurrency.clearCurrentOwnerMappingOnSessionMatch(sessionStore, userId, 'session-A');

        sinon.assert.calledTwice(redisClient.eval);
        expect(staleClear).to.equal(0);
        expect(ownerClear).to.equal(1);
        expect(state[redisKey]).to.equal(undefined);
    });

    it('propagates Redis failures when enforcement is enabled', async () => {
        const redisError = new Error('redis unavailable');
        const redisClient = {
            eval: sinon.stub().rejects(redisError)
        };
        const sessionConcurrency = new SessionConcurrency({singleActiveSessionEnabled: true, redisEnabled: true});
        let capturedError;

        try {
            await sessionConcurrency.validateCurrentOwnerAndRefreshTtl(createSessionStore(redisClient), userId, 'session-A');
        } catch (err) {
            capturedError = err;
        }

        expect(capturedError).to.equal(redisError);
    });

    it('keeps local/test no-op behaviour only when Redis is intentionally disabled', async () => {
        const sessionConcurrency = new SessionConcurrency({singleActiveSessionEnabled: true, redisEnabled: false});

        const ownershipStatus = await sessionConcurrency.validateCurrentOwnerAndRefreshTtl({}, userId, 'session-A');
        const activationResult = await sessionConcurrency.activateLatestSession({}, userId, 'session-A');

        expect(ownershipStatus).to.equal(SessionOwnershipStatusEnum.getNotEnforced());
        expect(activationResult.previousSessionId).to.equal(null);
        expect(activationResult.ownershipStatus).to.equal(SessionOwnershipStatusEnum.getNotEnforced());
    });

    it('returns unverifiable status without Redis calls when enforcement is enabled but identity inputs are missing', async () => {
        const redisClient = {eval: sinon.stub().resolves(1)};
        const sessionStore = createSessionStore(redisClient);
        const sessionConcurrency = new SessionConcurrency({singleActiveSessionEnabled: true, redisEnabled: true});

        const missingIdamUserIdResult = await sessionConcurrency.validateCurrentOwnerAndRefreshTtl(sessionStore, undefined, 'session-A');
        const missingRequestSessionIdResult = await sessionConcurrency.validateCurrentOwnerAndRefreshTtl(sessionStore, userId, undefined);

        expect(missingIdamUserIdResult).to.equal(SessionOwnershipStatusEnum.getUnverifiable());
        expect(missingRequestSessionIdResult).to.equal(SessionOwnershipStatusEnum.getUnverifiable());
        sinon.assert.notCalled(redisClient.eval);
    });

    it('keeps ownership operations as no-ops when feature is disabled even if Redis is enabled', async () => {
        const redisClient = {eval: sinon.stub().resolves(1)};
        const sessionStore = createSessionStore(redisClient);
        const sessionConcurrency = new SessionConcurrency({singleActiveSessionEnabled: false, redisEnabled: true, mappingTtl: 600});

        const activationResult = await sessionConcurrency.activateLatestSession(sessionStore, userId, 'session-A');
        const validationResult = await sessionConcurrency.validateCurrentOwnerAndRefreshTtl(sessionStore, userId, 'session-A');
        const clearResult = await sessionConcurrency.clearCurrentOwnerMappingOnSessionMatch(sessionStore, userId, 'session-A');

        expect(activationResult.previousSessionId).to.equal(null);
        expect(activationResult.ownershipStatus).to.equal(SessionOwnershipStatusEnum.getNotEnforced());
        expect(validationResult).to.equal(SessionOwnershipStatusEnum.getNotEnforced());
        expect(clearResult).to.equal(0);
        sinon.assert.notCalled(redisClient.eval);
        sinon.assert.notCalled(sessionStore.destroy);
    });

    it('uses the retained raw Redis client for ownership operations when the store client has no eval', async () => {
        const state = {};
        const rawRedisClient = {
            eval: sinon.stub().callsFake((script, keyCount, key, requestSessionId) => {
                if (script.includes('local previous')) {
                    const previousSessionId = state[key] || null;
                    state[key] = requestSessionId;
                    return Promise.resolve(previousSessionId);
                }
                if (state[key] === requestSessionId) {
                    return Promise.resolve(1);
                }
                if (!state[key] && script.includes('NX')) {
                    state[key] = requestSessionId;
                    return Promise.resolve(1);
                }
                return Promise.resolve(0);
            })
        };
        const sessionStore = {
            client: {
                get: sinon.stub(),
                set: sinon.stub(),
                del: sinon.stub()
            },
            redisClient: rawRedisClient,
            destroy: sinon.stub().callsFake((sessionId, callback) => callback())
        };
        const sessionConcurrency = new SessionConcurrency({singleActiveSessionEnabled: true, redisEnabled: true, mappingTtl: 300});

        await sessionConcurrency.activateLatestSession(sessionStore, 'idam-user-id', 'session-A');
        await sessionConcurrency.activateLatestSession(sessionStore, 'idam-user-id', 'session-B');
        const delayedAStillActive = await sessionConcurrency.validateCurrentOwnerAndRefreshTtl(sessionStore, 'idam-user-id', 'session-A');
        const sessionBStillActive = await sessionConcurrency.validateCurrentOwnerAndRefreshTtl(sessionStore, 'idam-user-id', 'session-B');

        expect(delayedAStillActive).to.equal(SessionOwnershipStatusEnum.getSuperseded());
        expect(sessionBStillActive).to.equal(SessionOwnershipStatusEnum.getCurrent());
        expect(state['session:active:user:idam-user-id']).to.equal('session-B');
        expect(sessionStore.client.eval).to.equal(undefined);
        sinon.assert.called(rawRedisClient.eval);
    });

    it('throws when Redis enforcement is enabled but session management is unavailable', async () => {
        const sessionConcurrency = new SessionConcurrency({singleActiveSessionEnabled: true, redisEnabled: true});

        expect(() => sessionConcurrency.canEnforceSessionOwnership({})).to.throw('Redis-backed session concurrency is enabled');
        expect(() => sessionConcurrency.canEnforceSessionOwnership({client: {get: sinon.stub()}})).to.throw('raw Redis client');
        expect(() => sessionConcurrency.canEnforceSessionOwnership({redisClient: {get: sinon.stub()}})).to.throw('required Redis commands');
    });
});
