'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const SessionConcurrency = require('app/services/SessionConcurrency');

describe('SessionConcurrency service', () => {
    it('registers the current session and destroys any previous active session', async () => {
        const redisClient = {
            get: sinon.stub().resolves('old-session-id'),
            set: sinon.stub().resolves(),
            del: sinon.stub().resolves()
        };
        const sessionStore = {
            client: redisClient,
            destroy: sinon.stub().callsFake((sessionId, callback) => callback())
        };
        const sessionConcurrency = new SessionConcurrency({enabled: 'true', mappingTtlSeconds: 300, redisKeyPrefix: 'session:active:user:'});

        await sessionConcurrency.registerAndInvalidatePreviousSession(sessionStore, 'user@example.com', 'new-session-id');

        sinon.assert.calledOnce(sessionStore.destroy);
        expect(sessionStore.destroy.firstCall.args[0]).to.equal('old-session-id');
        sinon.assert.calledWith(redisClient.set, 'session:active:user:user@example.com', 'new-session-id', 'EX', 300);
    });

    it('returns false when the current session does not match the active one', async () => {
        const redisClient = {
            get: sinon.stub().resolves('active-session-id'),
            set: sinon.stub().resolves(),
            del: sinon.stub().resolves()
        };
        const sessionStore = {client: redisClient};
        const sessionConcurrency = new SessionConcurrency({enabled: true});

        const isActive = await sessionConcurrency.isCurrentSessionActive(sessionStore, 'user@example.com', 'stale-session-id');

        expect(isActive).to.equal(false);
    });

    it('clears mapping only when it points to the terminating session', async () => {
        const redisClient = {
            get: sinon.stub().resolves('session-id-1'),
            set: sinon.stub().resolves(),
            del: sinon.stub().resolves()
        };
        const sessionStore = {client: redisClient};
        const sessionConcurrency = new SessionConcurrency({enabled: true, redisKeyPrefix: 'session:active:user:'});

        await sessionConcurrency.clearActiveSessionIdIfCurrent(sessionStore, 'user@example.com', 'session-id-1');

        sinon.assert.calledWith(redisClient.del, 'session:active:user:user@example.com');
    });

    it('is a no-op when redis-backed session management is unavailable', async () => {
        const sessionConcurrency = new SessionConcurrency({enabled: true});

        const isActive = await sessionConcurrency.isCurrentSessionActive({}, 'user@example.com', 'session-id-1');
        await sessionConcurrency.registerAndInvalidatePreviousSession({}, 'user@example.com', 'session-id-1');

        expect(isActive).to.equal(true);
    });
});



