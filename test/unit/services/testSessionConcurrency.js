'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const SessionConcurrency = require('app/services/SessionConcurrency');

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
        const state = {};
        const redisClient = {
            eval: sinon.stub().callsFake((script, keyCount, key, sessionId) => {
                const previous = state[key] || null;
                state[key] = sessionId;
                return Promise.resolve(previous);
            })
        };
        const sessionStore = createSessionStore(
            redisClient,
            sinon.stub().callsFake((sessionId, callback) => {
                expect(state[redisKey]).to.equal('new-session-id');
                callback();
            })
        );
        const sessionConcurrency = new SessionConcurrency({redisEnabled: true, sessionTtl: 300});
        state[redisKey] = 'old-session-id';

        const result = await sessionConcurrency.activateLatest(sessionStore, userId, 'new-session-id');

        sinon.assert.calledOnce(redisClient.eval);
        expect(result.previousSessionId).to.equal('old-session-id');
        sinon.assert.calledWith(sessionStore.destroy, 'old-session-id');
        expect(state[redisKey]).to.equal('new-session-id');
    });

    it('preserves the new mapping when previous-session destruction fails', async () => {
        const state = {};
        const redisClient = {
            eval: sinon.stub().callsFake((script, keyCount, key, sessionId) => {
                const previous = state[key] || null;
                state[key] = sessionId;
                return Promise.resolve(previous);
            })
        };
        const destroyError = new Error('destroy failed');
        const sessionStore = createSessionStore(
            redisClient,
            sinon.stub().callsFake((sessionId, callback) => callback(destroyError))
        );
        const sessionConcurrency = new SessionConcurrency({redisEnabled: true, sessionTtl: 300});
        state[redisKey] = 'old-session-id';

        const result = await sessionConcurrency.activateLatest(sessionStore, userId, 'new-session-id');

        expect(result.previousSessionId).to.equal('old-session-id');
        expect(result.destroyError).to.equal(destroyError);
        expect(state[redisKey]).to.equal('new-session-id');
    });

    it('rejects a stale protected request without allowing it to overwrite the owner', async () => {
        const state = {[redisKey]: 'new-session-id'};
        const redisClient = {
            eval: sinon.stub().callsFake((script, keyCount, key, sessionId) => {
                if (state[key] === sessionId) {
                    state[key] = sessionId;
                    return Promise.resolve(1);
                }
                return Promise.resolve(0);
            })
        };
        const sessionConcurrency = new SessionConcurrency({redisEnabled: true});

        const isActive = await sessionConcurrency.assertAndTouch(createSessionStore(redisClient), userId, 'old-session-id');

        sinon.assert.calledOnce(redisClient.eval);
        expect(isActive).to.equal(false);
        expect(state[redisKey]).to.equal('new-session-id');
    });

    it('atomically claims a missing mapping once for pre-deployment sessions', async () => {
        const state = {};
        const redisClient = {
            eval: sinon.stub().callsFake((script, keyCount, key, sessionId) => {
                if (state[key] === sessionId) {
                    return Promise.resolve(1);
                }
                if (!state[key]) {
                    state[key] = sessionId;
                    return Promise.resolve(1);
                }
                return Promise.resolve(0);
            })
        };
        const sessionConcurrency = new SessionConcurrency({redisEnabled: true});

        const sessionStore = createSessionStore(redisClient);
        const firstClaim = await sessionConcurrency.assertAndTouch(sessionStore, userId, 'session-A');
        const secondClaim = await sessionConcurrency.assertAndTouch(sessionStore, userId, 'session-B');

        sinon.assert.calledTwice(redisClient.eval);
        expect(firstClaim).to.equal(true);
        expect(secondClaim).to.equal(false);
        expect(state[redisKey]).to.equal('session-A');
    });

    it('refreshes TTL only for the current owner', async () => {
        const state = {[redisKey]: 'session-A'};
        const touches = [];
        const redisClient = {
            eval: sinon.stub().callsFake((script, keyCount, key, sessionId, ttl) => {
                if (state[key] === sessionId) {
                    touches.push({sessionId, ttl});
                    return Promise.resolve(1);
                }
                return Promise.resolve(0);
            })
        };
        const sessionConcurrency = new SessionConcurrency({redisEnabled: true, sessionTtl: 600});

        const sessionStore = createSessionStore(redisClient);
        const ownerResult = await sessionConcurrency.assertAndTouch(sessionStore, userId, 'session-A');
        const staleResult = await sessionConcurrency.assertAndTouch(sessionStore, userId, 'session-B');

        sinon.assert.calledTwice(redisClient.eval);
        expect(ownerResult).to.equal(true);
        expect(staleResult).to.equal(false);
        expect(touches).to.deep.equal([{sessionId: 'session-A', ttl: 600}]);
    });

    it('conditionally clears only the matching owner', async () => {
        const state = {[redisKey]: 'session-A'};
        const redisClient = {
            eval: sinon.stub().callsFake((script, keyCount, key, sessionId) => {
                if (state[key] === sessionId) {
                    delete state[key];
                    return Promise.resolve(1);
                }
                return Promise.resolve(0);
            })
        };
        const sessionConcurrency = new SessionConcurrency({redisEnabled: true});

        const sessionStore = createSessionStore(redisClient);
        const staleClear = await sessionConcurrency.clearIfCurrent(sessionStore, userId, 'session-B');
        const ownerClear = await sessionConcurrency.clearIfCurrent(sessionStore, userId, 'session-A');

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
        const sessionConcurrency = new SessionConcurrency({redisEnabled: true});

        try {
            await sessionConcurrency.assertAndTouch(createSessionStore(redisClient), userId, 'session-A');
            throw new Error('Expected assertAndTouch to reject.');
        } catch (err) {
            expect(err).to.equal(redisError);
        }
    });

    it('keeps local/test no-op behaviour only when Redis is intentionally disabled', async () => {
        const sessionConcurrency = new SessionConcurrency({redisEnabled: false});

        const isActive = await sessionConcurrency.assertAndTouch({}, userId, 'session-A');
        const activationResult = await sessionConcurrency.activateLatest({}, userId, 'session-A');

        expect(isActive).to.equal(true);
        expect(activationResult.previousSessionId).to.equal(null);
    });

    it('throws when Redis enforcement is enabled but session management is unavailable', async () => {
        const sessionConcurrency = new SessionConcurrency({redisEnabled: true});

        expect(() => sessionConcurrency.canManageSession({})).to.throw('Redis-backed session concurrency is enabled');
        expect(() => sessionConcurrency.canManageSession({client: {get: sinon.stub()}})).to.throw('raw Redis client');
        expect(() => sessionConcurrency.canManageSession({redisClient: {get: sinon.stub()}})).to.throw('required Redis commands');
    });
});
