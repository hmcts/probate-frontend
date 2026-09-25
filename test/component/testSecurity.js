'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const request = require('supertest');
const app = require('app');
const config = require('config');
const oAuth2CallbackUrl = config.services.idam.probate_oauth_callback_path;
const oAuth2TokenUrl = config.services.idam.probate_oauth_token_path;
const TaskList = require('app/steps/ui/tasklist');
const TimeoutPage = require('app/steps/ui/timeout/index');
const SessionConcurrency = require('app/services/SessionConcurrency');
const nock = require('nock');

describe('security', () => {
    const LOGIN_URL = 'http://localhost:3501/login';
    const expectedNextUrlForTaskList = TaskList.getUrl();
    const expectedUrlForTimeoutPage = TimeoutPage.getUrl();
    const SECURITY_COOKIE = '__auth-token-' + config.payloadVersion;

    it(`Redirects to login when idam returns 401 from Oauth2Token.post() request: ${LOGIN_URL}`, (done) => {
        nock(config.services.idam.apiUrl)
            .post(oAuth2TokenUrl)
            .reply(401, new Error('Unauthorized'));

        const server = app.init();
        const agent = request.agent(server.app);
        agent.get(oAuth2CallbackUrl)
            .set('Cookie', [`__redirect=${JSON.stringify({state: 'testState'})}`])
            .query({code: 12345})
            .query({state: 'testState'})
            .expect(302)
            .end((err, res) => {
                server.http.close();
                if (err) {
                    nock.cleanAll();
                    done(err);
                } else {
                    expect(res.headers.location).to.contain(LOGIN_URL);
                    nock.cleanAll();
                    done();
                }
            });
    }).timeout(5000);

    it('Displays an error page when when a error other than 401 is returned from Oauth2Token.post() request', (done) => {
        const server = app.init();
        const agent = request.agent(server.app);
        agent.get(oAuth2CallbackUrl)
            .set('Cookie', [`__redirect=${JSON.stringify({state: 'testState'})}`])
            .query({code: 12345})
            .query({state: 'testState'})
            .expect('Content-type', /html/)
            .expect(403)
            .end((err, res) => {
                server.http.close();
                if (err) {
                    done(err);
                } else {
                    const text = res.text.toLowerCase();
                    expect(text).to.contain('not authorised');
                    done();
                }
            });
    }).timeout(5000);

    it(`Redirects to login if __auth-token does not contain current payloadVersion: ${LOGIN_URL}`, (done) => {
        config.app.useIDAM = 'true';
        const server = app.init();
        const agent = request.agent(server.app);

        agent.get(expectedNextUrlForTaskList)
            .set('Cookie', ['__auth-token-v2.5.0=dummyToken'])
            .expect(302)
            .end((err, res) => {
                server.http.close();
                config.app.useIDAM = 'false';
                if (err) {
                    done(err);
                } else {
                    expect(res.headers.location).to.contain(LOGIN_URL);
                    done();
                }
            });
    }).timeout(5000);

    it(`Redirects to timeout if no session is available: ${expectedUrlForTimeoutPage}`, (done) => {
        nock(config.services.idam.apiUrl)
            .get('/details')
            .reply(200, {name: 'Success'});

        config.app.useIDAM = 'true';
        const server = app.init();
        const agent = request.agent(server.app);

        agent.get(expectedNextUrlForTaskList)
            .set('Cookie', SECURITY_COOKIE + '=dummyToken')
            .expect(302)
            .end((err, res) => {
                server.http.close();
                config.app.useIDAM = 'false';
                if (err) {
                    nock.cleanAll();
                    done(err);
                } else {
                    expect(res.headers.location).to.contain(expectedUrlForTimeoutPage);
                    nock.cleanAll();
                    done();
                }
            });
    }).timeout(5000);

    it('invalidates session A after session B logs in for the same user', async () => {
        config.app.useIDAM = 'true';

        const activeSessionByUser = {};
        const canManageSessionStub = sinon.stub(SessionConcurrency.prototype, 'canManageSession').returns(true);
        const activateStub = sinon.stub(SessionConcurrency.prototype, 'activateLatest')
            .callsFake((sessionStore, userId, currentSessionId) => {
                const previousSessionId = activeSessionByUser[userId] || null;
                activeSessionByUser[userId] = currentSessionId;
                return Promise.resolve({previousSessionId});
            });
        const assertAndTouchStub = sinon.stub(SessionConcurrency.prototype, 'assertAndTouch')
            .callsFake((sessionStore, userId, currentSessionId) => {
                return Promise.resolve(activeSessionByUser[userId] === currentSessionId);
            });

        nock(config.services.idam.apiUrl)
            .post(oAuth2TokenUrl)
            .times(2)
            .reply(200, {access_token: 'dummyToken'});

        nock(config.services.idam.apiUrl)
            .get('/details')
            .times(4)
            .reply(200, {email: 'same-user@example.com', id: 'idam-user-id', roles: ['probate-private-beta', 'citizen']});

        const server = app.init();
        const agentA = request.agent(server.app);
        const agentB = request.agent(server.app);
        try {
            await agentA.get(oAuth2CallbackUrl)
                .set('Cookie', `__redirect=${JSON.stringify({state: 'state-A', continue_url: expectedNextUrlForTaskList})}`)
                .query({code: 11111, state: 'state-A'})
                .expect(302);

            await agentB.get(oAuth2CallbackUrl)
                .set('Cookie', `__redirect=${JSON.stringify({state: 'state-B', continue_url: expectedNextUrlForTaskList})}`)
                .query({code: 22222, state: 'state-B'})
                .expect(302);

            const resProtected = await agentA.get(expectedNextUrlForTaskList)
                .set('Cookie', `${SECURITY_COOKIE}=dummyToken`)
                .expect(302);

            expect(resProtected.headers.location).to.contain(expectedUrlForTimeoutPage);

            const resSessionB = await agentB.get(expectedNextUrlForTaskList)
                .set('Cookie', `${SECURITY_COOKIE}=dummyToken`)
                .expect(200);

            expect(resSessionB.headers.location).to.equal(undefined);
            expect(resSessionB.error).to.equal(false);
        } finally {
            canManageSessionStub.restore();
            activateStub.restore();
            assertAndTouchStub.restore();
            config.app.useIDAM = 'false';
            nock.cleanAll();
            await new Promise(resolve => server.http.close(resolve));
        }
    }).timeout(8000);

    it('prevents an in-flight protected request from reactivating itself after a newer login wins', async () => {
        config.app.useIDAM = 'true';

        const activeSessionByUser = {};
        let pendingValidation;
        let releaseValidation;
        const canManageSessionStub = sinon.stub(SessionConcurrency.prototype, 'canManageSession').returns(true);
        const activateStub = sinon.stub(SessionConcurrency.prototype, 'activateLatest')
            .callsFake((sessionStore, userId, currentSessionId) => {
                const previousSessionId = activeSessionByUser[userId] || null;
                activeSessionByUser[userId] = currentSessionId;
                return Promise.resolve({previousSessionId});
            });
        const assertAndTouchStub = sinon.stub(SessionConcurrency.prototype, 'assertAndTouch')
            .callsFake((sessionStore, userId, currentSessionId) => {
                if (!pendingValidation) {
                    pendingValidation = new Promise(resolve => {
                        releaseValidation = resolve;
                    }).then(() => activeSessionByUser[userId] === currentSessionId);
                    return pendingValidation;
                }
                return Promise.resolve(activeSessionByUser[userId] === currentSessionId);
            });

        nock(config.services.idam.apiUrl)
            .post(oAuth2TokenUrl)
            .times(2)
            .reply(200, {access_token: 'dummyToken'});

        nock(config.services.idam.apiUrl)
            .get('/details')
            .times(4)
            .reply(200, {email: 'same-user@example.com', id: 'idam-user-id', roles: ['probate-private-beta', 'citizen']});

        const server = app.init();
        const agentA = request.agent(server.app);
        const agentB = request.agent(server.app);
        try {
            await agentA.get(oAuth2CallbackUrl)
                .set('Cookie', `__redirect=${JSON.stringify({state: 'state-A', continue_url: expectedNextUrlForTaskList})}`)
                .query({code: 11111, state: 'state-A'})
                .expect(302);

            const protectedA = agentA.get(expectedNextUrlForTaskList)
                .set('Cookie', `${SECURITY_COOKIE}=dummyToken`)
                .expect(302)
                .then(res => res);

            while (!pendingValidation) {
                await new Promise(resolve => setTimeout(resolve, 10));
            }

            await agentB.get(oAuth2CallbackUrl)
                .set('Cookie', `__redirect=${JSON.stringify({state: 'state-B', continue_url: expectedNextUrlForTaskList})}`)
                .query({code: 22222, state: 'state-B'})
                .expect(302);

            releaseValidation();
            const resProtectedA = await protectedA;

            expect(resProtectedA.headers.location).to.contain(expectedUrlForTimeoutPage);
            expect(activateStub.callCount).to.equal(2);

            const resSessionB = await agentB.get(expectedNextUrlForTaskList)
                .set('Cookie', `${SECURITY_COOKIE}=dummyToken`)
                .expect(200);

            expect(resSessionB.headers.location).to.equal(undefined);
            expect(resSessionB.error).to.equal(false);
        } finally {
            canManageSessionStub.restore();
            activateStub.restore();
            assertAndTouchStub.restore();
            config.app.useIDAM = 'false';
            nock.cleanAll();
            await new Promise(resolve => server.http.close(resolve));
        }
    }).timeout(8000);

    it('uses the retained raw Redis client for ownership operations when the store client has no eval', async () => {
        const state = {};
        const rawRedisClient = {
            eval: sinon.stub().callsFake((script, keyCount, key, sessionId) => {
                if (script.includes('local previous')) {
                    const previousSessionId = state[key] || null;
                    state[key] = sessionId;
                    return Promise.resolve(previousSessionId);
                }
                if (state[key] === sessionId) {
                    return Promise.resolve(1);
                }
                if (!state[key] && script.includes('NX')) {
                    state[key] = sessionId;
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
        const sessionConcurrency = new SessionConcurrency({redisEnabled: true, sessionTtl: 300});

        await sessionConcurrency.activateLatest(sessionStore, 'idam-user-id', 'session-A');
        await sessionConcurrency.activateLatest(sessionStore, 'idam-user-id', 'session-B');
        const delayedAStillActive = await sessionConcurrency.assertAndTouch(sessionStore, 'idam-user-id', 'session-A');
        const sessionBStillActive = await sessionConcurrency.assertAndTouch(sessionStore, 'idam-user-id', 'session-B');

        expect(delayedAStillActive).to.equal(false);
        expect(sessionBStillActive).to.equal(true);
        expect(state['session:active:user:idam-user-id']).to.equal('session-B');
        expect(sessionStore.client.eval).to.equal(undefined);
        sinon.assert.called(rawRedisClient.eval);
    });
});
