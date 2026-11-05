'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const request = require('supertest');
const app = require('app');
const config = require('config');
const oAuth2CallbackUrl = config.services.idam.probate_oauth_callback_path;
const oAuth2TokenUrl = config.services.idam.probate_oauth_token_path;
const TaskList = require('app/steps/ui/tasklist');
const SessionConcurrency = require('app/services/SessionConcurrency');
const nock = require('nock');

describe('security', () => {
    const LOGIN_URL = 'http://localhost:3501/login';
    const expectedNextUrlForTaskList = TaskList.getUrl();
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

    it(`Redirects to normal sign-in if no session is available: ${LOGIN_URL}`, (done) => {
        nock(config.services.idam.apiUrl)
            .get('/details')
            .reply(200, {name: 'Success'});
        nock(config.services.idam.apiUrl)
            .delete(/\/session\/.*/)
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
                    expect(res.headers.location).to.contain(LOGIN_URL);
                    nock.cleanAll();
                    done();
                }
            });
    }).timeout(5000);

    it('invalidates session A after session B logs in for the same user', async () => {
        config.app.useIDAM = 'true';
        const browserAToken = 'dummyTokenA';
        const browserBToken = 'dummyTokenB';
        const browserAReauthToken = 'dummyTokenA-reauth';

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
            .reply(200, {access_token: browserAToken});
        nock(config.services.idam.apiUrl)
            .post(oAuth2TokenUrl)
            .reply(200, {access_token: browserBToken});
        nock(config.services.idam.apiUrl)
            .post(oAuth2TokenUrl)
            .reply(200, {access_token: browserAReauthToken});

        nock(config.services.idam.apiUrl)
            .get('/details')
            .times(5)
            .reply(200, {email: 'same-user@example.com', id: 'idam-user-id', roles: ['probate-private-beta', 'citizen']});
        nock(config.services.idam.apiUrl)
            .delete(/\/session\/.*/)
            .reply(200, {name: 'Success'});

        const server = app.init();
        const agentA = request.agent(server.app);
        const agentB = request.agent(server.app);
        try {
            const callbackA = await agentA.get(oAuth2CallbackUrl)
                .set('Cookie', `__redirect=${JSON.stringify({state: 'state-A', continue_url: expectedNextUrlForTaskList})}`)
                .query({code: 11111, state: 'state-A'})
                .expect(302);
            const supersededSessionCookieA = getCookieValueFromSetCookie(callbackA.headers['set-cookie'], 'connect.sid');
            const authCookieA = getCookieValueFromSetCookie(callbackA.headers['set-cookie'], SECURITY_COOKIE);
            expect(supersededSessionCookieA).to.be.a('string');
            expect(authCookieA).to.be.a('string');

            const callbackB = await agentB.get(oAuth2CallbackUrl)
                .set('Cookie', `__redirect=${JSON.stringify({state: 'state-B', continue_url: expectedNextUrlForTaskList})}`)
                .query({code: 22222, state: 'state-B'})
                .expect(302);
            const sessionCookieB = getCookieValueFromSetCookie(callbackB.headers['set-cookie'], 'connect.sid');
            const authCookieB = getCookieValueFromSetCookie(callbackB.headers['set-cookie'], SECURITY_COOKIE);
            expect(sessionCookieB).to.be.a('string');
            expect(authCookieB).to.be.a('string');
            expect(authCookieA).to.not.equal(authCookieB);
            expect(supersededSessionCookieA).to.not.equal(sessionCookieB);

            const resProtected = await agentA.get(expectedNextUrlForTaskList)
                .set('Cookie', `${authCookieA}; ${supersededSessionCookieA}`)
                .expect(302);

            expect(resProtected.headers.location).to.contain(LOGIN_URL);
            const resSessionB = await agentB.get(expectedNextUrlForTaskList)
                .set('Cookie', `${authCookieB}; ${sessionCookieB}`)
                .expect(200);

            expect(resSessionB.headers.location).to.equal(undefined);
            expect(resSessionB.error).to.equal(false);

            const reauthState = new URL(resProtected.headers.location).searchParams.get('state');
            const reauthRedirectCookie = getCookieValueFromSetCookie(resProtected.headers['set-cookie'], '__redirect');
            expect(reauthRedirectCookie).to.be.a('string');
            const reauthCallback = await agentA.get(oAuth2CallbackUrl)
                .set('Cookie', reauthRedirectCookie)
                .query({code: 33333, state: reauthState})
                .expect(302);
            const reauthenticatedSessionCookieA = getCookieValueFromSetCookie(reauthCallback.headers['set-cookie'], 'connect.sid');
            expect(reauthenticatedSessionCookieA).to.be.a('string');
            expect(reauthenticatedSessionCookieA).to.not.equal(supersededSessionCookieA);
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
        const browserAToken = 'dummyTokenA';
        const browserBToken = 'dummyTokenB';

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
            .reply(200, {access_token: browserAToken});
        nock(config.services.idam.apiUrl)
            .post(oAuth2TokenUrl)
            .reply(200, {access_token: browserBToken});

        nock(config.services.idam.apiUrl)
            .get('/details')
            .times(4)
            .reply(200, {email: 'same-user@example.com', id: 'idam-user-id', roles: ['probate-private-beta', 'citizen']});
        nock(config.services.idam.apiUrl)
            .delete(/\/session\/.*/)
            .reply(200, {name: 'Success'});

        const server = app.init();
        const agentA = request.agent(server.app);
        const agentB = request.agent(server.app);
        try {
            const callbackA = await agentA.get(oAuth2CallbackUrl)
                .set('Cookie', `__redirect=${JSON.stringify({state: 'state-A', continue_url: expectedNextUrlForTaskList})}`)
                .query({code: 11111, state: 'state-A'})
                .expect(302);
            const authCookieA = getCookieValueFromSetCookie(callbackA.headers['set-cookie'], SECURITY_COOKIE);
            expect(authCookieA).to.be.a('string');

            const protectedA = agentA.get(expectedNextUrlForTaskList)
                .set('Cookie', authCookieA)
                .expect(302)
                .then(res => res);

            while (!pendingValidation) {
                await new Promise(resolve => setTimeout(resolve, 10));
            }

            const callbackB = await agentB.get(oAuth2CallbackUrl)
                .set('Cookie', `__redirect=${JSON.stringify({state: 'state-B', continue_url: expectedNextUrlForTaskList})}`)
                .query({code: 22222, state: 'state-B'})
                .expect(302);
            const authCookieB = getCookieValueFromSetCookie(callbackB.headers['set-cookie'], SECURITY_COOKIE);
            expect(authCookieB).to.be.a('string');

            releaseValidation();
            const resProtectedA = await protectedA;

            expect(resProtectedA.headers.location).to.contain(LOGIN_URL);
            expect(activateStub.callCount).to.equal(2);

            const resSessionB = await agentB.get(expectedNextUrlForTaskList)
                .set('Cookie', authCookieB)
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

    function getCookieValueFromSetCookie(setCookieHeader, cookieName) {
        const cookieEntries = Array.isArray(setCookieHeader) ? setCookieHeader : [];
        const cookie = cookieEntries.find(entry => entry.startsWith(`${cookieName}=`));
        return cookie ? cookie.split(';')[0] : undefined;
    }
});
