'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const request = require('supertest');
const nock = require('nock');
const config = require('config');
const app = require('app');
const ownedLoopbackListeners = new Set();
const isOwnedLoopbackHost = host => ownedLoopbackListeners.has(host);
let oAuth2CallbackUrl;
let oAuth2TokenUrl;
let TaskList;
let SessionConcurrency;
let SessionOwnershipStatusEnum;
let UIStepRunner;
let AdditionalExecutorInvite;

describe('security', () => {
    const LOGIN_URL = 'http://localhost:3501/login';
    const SERVER_CLOSE_TIMEOUT_MS = 1500;
    const ABORT_WAIT_TIMEOUT_MS = 1000;
    let IDAM_LOGIN_ORIGIN;
    let expectedNextUrlForTaskList;
    let IDAM_ACCESS_TOKEN_COOKIE;
    const ownedServers = new Set();
    const retainedScopes = [];
    let originalTlsRejectUnauthorized;

    const retainScope = scope => {
        retainedScopes.push(scope);
        return scope;
    };

    const registerOwnedLoopbackHosts = (httpServer) => {
        const address = httpServer.address();
        if (address && typeof address === 'object' && address.port) {
            ownedLoopbackListeners.add(`127.0.0.1:${address.port}`);
            ownedLoopbackListeners.add(`localhost:${address.port}`);
            ownedLoopbackListeners.add(`[::1]:${address.port}`);
        }
    };

    const registerOwnedServer = (httpServer) => {
        ownedServers.add(httpServer);
        registerOwnedLoopbackHosts(httpServer);
        if (httpServer && typeof httpServer.on === 'function') {
            httpServer.on('listening', () => {
                registerOwnedLoopbackHosts(httpServer);
            });
        }
        return httpServer;
    };

    const closeOwnedServer = (httpServer, timeoutMs = SERVER_CLOSE_TIMEOUT_MS) => new Promise((resolve, reject) => {
        if (!httpServer || !httpServer.listening) {
            resolve();
            return;
        }
        let settled = false;
        const finish = (err) => {
            if (settled) {
                return;
            }
            settled = true;
            clearTimeout(timeoutId);
            if (err) {
                reject(err);
                return;
            }
            resolve();
        };
        const timeoutId = setTimeout(() => {
            finish(new Error(`Timed out closing owned server within ${timeoutMs}ms`));
        }, timeoutMs);
        try {
            httpServer.close(err => finish(err));
            if (typeof httpServer.closeIdleConnections === 'function') {
                httpServer.closeIdleConnections();
            }
            if (typeof httpServer.closeAllConnections === 'function') {
                httpServer.closeAllConnections();
            }
        } catch (err) {
            finish(err);
        }
    });

    before(() => {
        originalTlsRejectUnauthorized = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        nock.disableNetConnect();
        nock.enableNetConnect(isOwnedLoopbackHost);
        oAuth2CallbackUrl = config.services.idam.probate_oauth_callback_path;
        oAuth2TokenUrl = config.services.idam.probate_oauth_token_path;
        TaskList = require('app/steps/ui/tasklist');
        SessionConcurrency = require('app/services/SessionConcurrency');
        SessionOwnershipStatusEnum = require('app/utils/SessionOwnershipStatusEnum');
        UIStepRunner = require('app/core/runners/UIStepRunner');
        AdditionalExecutorInvite = require('app/utils/AdditionalExecutorInvite');
        IDAM_LOGIN_ORIGIN = new URL(config.services.idam.loginUrl).origin;
        expectedNextUrlForTaskList = TaskList.getUrl();
        IDAM_ACCESS_TOKEN_COOKIE = '__auth-token-' + config.payloadVersion;
    });

    afterEach(async () => {
        let scopeAssertionError;
        let ownedServerCloseError;
        try {
            retainedScopes.forEach(scope => {
                expect(scope.isDone(), `Unconsumed nock scope: ${scope.pendingMocks().join(', ')}`).to.equal(true);
            });
        } catch (err) {
            scopeAssertionError = err;
        } finally {
            retainedScopes.length = 0;
            nock.abortPendingRequests();
            nock.cleanAll();
            try {
                await Promise.all([...ownedServers].map(server => closeOwnedServer(server)));
            } catch (err) {
                ownedServerCloseError = err;
            } finally {
                ownedServers.clear();
                ownedLoopbackListeners.clear();
            }
        }
        if (scopeAssertionError) {
            throw scopeAssertionError;
        }
        if (ownedServerCloseError) {
            throw ownedServerCloseError;
        }
    });

    after(() => {
        if (typeof originalTlsRejectUnauthorized === 'undefined') {
            delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
        } else {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalTlsRejectUnauthorized;
        }
        nock.enableNetConnect();
    });

    it('includes the IDAM origin in the CSP form-action directive', (done) => {
        const server = app.init();
        const retainedServer = registerOwnedServer(server.http);
        const agent = request.agent(retainedServer);

        agent.get('/health/liveness')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    const csp = res.headers['content-security-policy'];
                    expect(csp).to.be.a('string');
                    const formAction = (csp.match(/form-action\s([^;]+)/) || [])[1];
                    expect(formAction).to.be.a('string');
                    expect(formAction).to.contain(IDAM_LOGIN_ORIGIN);
                    done();
                }
            });
    });

    it(`Redirects to login when idam returns 401 from Oauth2Token.post() request: ${LOGIN_URL}`, (done) => {
        const tokenScope = retainScope(nock(config.services.idam.apiUrl)
            .post(oAuth2TokenUrl)
            .reply(401, new Error('Unauthorized')));

        const server = app.init();
        const retainedServer = registerOwnedServer(server.http);
        const agent = request.agent(retainedServer);
        agent.get(oAuth2CallbackUrl)
            .set('Cookie', [`__redirect=${JSON.stringify({state: 'testState'})}`])
            .query({code: 12345})
            .query({state: 'testState'})
            .expect(302)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    expect(res.headers.location).to.contain(LOGIN_URL);
                    expect(tokenScope.isDone()).to.equal(true);
                    done();
                }
            });
    }).timeout(5000);

    it('Uses the technical-error path when a non-401 error is returned from Oauth2Token.post() request', (done) => {
        const tokenScope = retainScope(nock(config.services.idam.apiUrl)
            .post(oAuth2TokenUrl)
            .reply(500, {error: 'idam-failure'}));
        const server = app.init();
        const retainedServer = registerOwnedServer(server.http);
        const agent = request.agent(retainedServer);
        agent.get(oAuth2CallbackUrl)
            .set('Cookie', [`__redirect=${JSON.stringify({state: 'testState'})}`])
            .query({code: 12345})
            .query({state: 'testState'})
            .expect('Content-type', /html/)
            .expect(500)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    const text = res.text.toLowerCase();
                    expect(text).to.contain('there is a problem');
                    expect(tokenScope.isDone()).to.equal(true);
                    done();
                }
            });
    }).timeout(5000);

    it(`Redirects to login if __auth-token does not contain current payloadVersion: ${LOGIN_URL}`, async () => {
        const originalUseIDAM = config.app.useIDAM;
        config.app.useIDAM = 'true';
        const server = app.init();
        const retainedServer = registerOwnedServer(server.http);
        const agent = request.agent(retainedServer);
        try {
            const res = await agent.get(expectedNextUrlForTaskList)
                .set('Cookie', ['__auth-token-v2.5.0=dummyToken'])
                .expect(302);
            expect(res.headers.location).to.contain(LOGIN_URL);
        } finally {
            config.app.useIDAM = originalUseIDAM;
        }
    }).timeout(5000);

    it(`Redirects to normal sign-in if no session is available: ${LOGIN_URL}`, async () => {
        const deleteScope = retainScope(nock(config.services.idam.apiUrl)
            .delete(/\/session\/.*/)
            .reply(200, {name: 'Success'}));
        const originalUseIDAM = config.app.useIDAM;
        config.app.useIDAM = 'true';
        const server = app.init();
        const retainedServer = registerOwnedServer(server.http);
        const agent = request.agent(retainedServer);
        try {
            const res = await agent.get(expectedNextUrlForTaskList)
                .set('Cookie', IDAM_ACCESS_TOKEN_COOKIE + '=dummyToken')
                .expect(302);
            expect(res.headers.location).to.contain(LOGIN_URL);
            expect(deleteScope.isDone()).to.equal(true);
        } finally {
            config.app.useIDAM = originalUseIDAM;
        }
    }).timeout(5000);

    it('invalidates session A after session B logs in for the same user', async () => {
        const originalUseIDAM = config.app.useIDAM;
        const originalUseCSRFProtection = config.app.useCSRFProtection;
        config.app.useIDAM = 'true';
        config.app.useCSRFProtection = 'true';
        const browserAToken = 'dummyTokenA';
        const browserBToken = 'dummyTokenB';
        const handlePostSpy = sinon.spy(UIStepRunner.prototype, 'handlePost');

        const currentOwnerSessionByUser = {};
        const activateStub = sinon.stub(SessionConcurrency.prototype, 'activateLatestSession')
            .callsFake((sessionStore, userId, newlyAuthenticatedSessionId) => {
                const previousSessionId = currentOwnerSessionByUser[userId] || null;
                currentOwnerSessionByUser[userId] = newlyAuthenticatedSessionId;
                if (!previousSessionId || typeof sessionStore?.destroy !== 'function') {
                    return Promise.resolve({
                        previousSessionId,
                        ownershipStatus: SessionOwnershipStatusEnum.getCurrent()
                    });
                }

                return new Promise(resolve => {
                    sessionStore.destroy(previousSessionId, destroyError => resolve({
                        previousSessionId,
                        ownershipStatus: SessionOwnershipStatusEnum.getCurrent(),
                        destroyError
                    }));
                });
            });
        const validateCurrentOwnerAndRefreshTtlStub = sinon.stub(SessionConcurrency.prototype, 'validateCurrentOwnerAndRefreshTtl')
            .callsFake((sessionStore, userId, currentSessionId) => {
                return Promise.resolve(
                    currentOwnerSessionByUser[userId] === currentSessionId
                        ? SessionOwnershipStatusEnum.getCurrent()
                        : SessionOwnershipStatusEnum.getSuperseded()
                );
            });

        const tokenScopeA = retainScope(nock(config.services.idam.apiUrl)
            .post(oAuth2TokenUrl)
            .reply(200, {access_token: browserAToken}));
        const tokenScopeB = retainScope(nock(config.services.idam.apiUrl)
            .post(oAuth2TokenUrl)
            .reply(200, {access_token: browserBToken}));

        const detailsScope = retainScope(nock(config.services.idam.apiUrl)
            .get('/details')
            .times(3)
            .reply(200, {email: 'same-user@example.com', id: 'idam-user-id', roles: ['probate-private-beta', 'citizen']}));
        const deleteScope = retainScope(nock(config.services.idam.apiUrl)
            .delete(/\/session\/.*/)
            .times(2)
            .reply(200, {name: 'Success'}));

        expect(String(config.singleActiveSession.enabled)).to.equal('true');
        const server = app.init();
        const retainedServer = registerOwnedServer(server.http);
        const agentA = request.agent(retainedServer);
        const agentB = request.agent(retainedServer);
        try {
            const callbackA = await agentA.get(oAuth2CallbackUrl)
                .set('Cookie', `__redirect=${JSON.stringify({state: 'state-A', continue_url: expectedNextUrlForTaskList})}`)
                .query({code: 11111, state: 'state-A'})
                .expect(302);
            const supersededSessionCookieA = getCookieValueFromSetCookie(callbackA.headers['set-cookie'], 'connect.sid');
            const authCookieA = getCookieValueFromSetCookie(callbackA.headers['set-cookie'], IDAM_ACCESS_TOKEN_COOKIE);
            expect(supersededSessionCookieA).to.be.a('string');
            expect(authCookieA).to.be.a('string');
            const browserAFormPage = await agentA.get('/death-certificate-english')
                .set('Cookie', `${authCookieA}; ${supersededSessionCookieA}`)
                .expect(200);
            const browserAOriginalCsrfToken = getCsrfTokenFromPage(browserAFormPage.text);

            const callbackB = await agentB.get(oAuth2CallbackUrl)
                .set('Cookie', `__redirect=${JSON.stringify({state: 'state-B', continue_url: expectedNextUrlForTaskList})}`)
                .query({code: 22222, state: 'state-B'})
                .expect(302);
            const sessionCookieB = getCookieValueFromSetCookie(callbackB.headers['set-cookie'], 'connect.sid');
            const authCookieB = getCookieValueFromSetCookie(callbackB.headers['set-cookie'], IDAM_ACCESS_TOKEN_COOKIE);
            expect(sessionCookieB).to.be.a('string');
            expect(authCookieB).to.be.a('string');
            expect(authCookieA).to.not.equal(authCookieB);
            expect(supersededSessionCookieA).to.not.equal(sessionCookieB);

            const resPublicScreener = await agentA.post('/death-certificate-english')
                .set('Cookie', `${authCookieA}; ${supersededSessionCookieA}`)
                .type('form')
                .send({_csrf: browserAOriginalCsrfToken, deathCertificateInEnglish: 'optionYes'})
                .expect(303);
            const resProtectedPage = await agentA.post('/deceased-details')
                .set('Cookie', `${authCookieA}; ${supersededSessionCookieA}`)
                .type('form')
                .send({_csrf: browserAOriginalCsrfToken, deceasedFirstName: 'Jane'})
                .expect(303);

            expect(resPublicScreener.headers.location.startsWith(LOGIN_URL)).to.equal(true);
            expect(resProtectedPage.headers.location.startsWith(LOGIN_URL)).to.equal(true);
            sinon.assert.notCalled(handlePostSpy);
            expectCookieExpired(resPublicScreener.headers['set-cookie'], IDAM_ACCESS_TOKEN_COOKIE);
            expectCookieExpired(resPublicScreener.headers['set-cookie'], 'connect.sid');
            expectCookieExpired(resProtectedPage.headers['set-cookie'], IDAM_ACCESS_TOKEN_COOKIE);
            expectCookieExpired(resProtectedPage.headers['set-cookie'], 'connect.sid');
            const resSessionB = await agentB.get(expectedNextUrlForTaskList)
                .set('Cookie', `${authCookieB}; ${sessionCookieB}`)
                .expect(200);

            expect(resSessionB.headers.location).to.equal(undefined);
            expect(resSessionB.error).to.equal(false);
            expect(tokenScopeA.isDone()).to.equal(true);
            expect(tokenScopeB.isDone()).to.equal(true);
            expect(detailsScope.isDone()).to.equal(true);
            expect(deleteScope.isDone()).to.equal(true);
        } finally {
            activateStub.restore();
            validateCurrentOwnerAndRefreshTtlStub.restore();
            handlePostSpy.restore();
            config.app.useIDAM = originalUseIDAM;
            config.app.useCSRFProtection = originalUseCSRFProtection;
        }
    }).timeout(8000);

    it('prevents an in-flight protected request from reactivating itself after a newer login wins', async () => {
        const originalUseIDAM = config.app.useIDAM;
        const originalUseCSRFProtection = config.app.useCSRFProtection;
        config.app.useIDAM = 'true';
        config.app.useCSRFProtection = 'true';
        const browserAToken = 'dummyTokenA';
        const browserBToken = 'dummyTokenB';
        const requestTimeoutMs = 2500;

        const currentOwnerSessionByUser = {};
        let pendingValidation;
        let releaseValidation;
        let protectedARequest;
        let protectedAResponsePromise = Promise.resolve();
        let protectedASettled = false;
        const additionalInviteSpy = sinon.spy(AdditionalExecutorInvite, 'invite');
        const waitForPendingValidation = async (timeoutMs) => {
            const startedAt = Date.now();
            while (!pendingValidation) {
                if (Date.now() - startedAt > timeoutMs) {
                    throw new Error('Timed out waiting for Browser A ownership validation to start');
                }
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        };
        const awaitWithDeadline = (promise, timeoutMs, timeoutMessage) => {
            let timeoutId;
            const timeoutPromise = new Promise((resolve, reject) => {
                timeoutId = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
            });
            return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
        };
        // Pause Browser A at ownership validation while Browser B logs in; Redis is stubbed here to exercise request orchestration, not Lua atomicity.
        const activateStub = sinon.stub(SessionConcurrency.prototype, 'activateLatestSession')
            .callsFake((sessionStore, userId, newlyAuthenticatedSessionId) => {
                const previousSessionId = currentOwnerSessionByUser[userId] || null;
                currentOwnerSessionByUser[userId] = newlyAuthenticatedSessionId;
                return Promise.resolve({
                    previousSessionId,
                    ownershipStatus: SessionOwnershipStatusEnum.getCurrent()
                });
            });
        const validateCurrentOwnerAndRefreshTtlStub = sinon.stub(SessionConcurrency.prototype, 'validateCurrentOwnerAndRefreshTtl')
            .callsFake((sessionStore, userId, currentSessionId) => {
                if (!pendingValidation) {
                    pendingValidation = new Promise(resolve => {
                        releaseValidation = resolve;
                    }).then(() => (
                        currentOwnerSessionByUser[userId] === currentSessionId
                            ? SessionOwnershipStatusEnum.getCurrent()
                            : SessionOwnershipStatusEnum.getSuperseded()
                    ));
                    return pendingValidation;
                }
                return Promise.resolve(
                    currentOwnerSessionByUser[userId] === currentSessionId
                        ? SessionOwnershipStatusEnum.getCurrent()
                        : SessionOwnershipStatusEnum.getSuperseded()
                );
            });

        const tokenScopeA = retainScope(nock(config.services.idam.apiUrl)
            .post(oAuth2TokenUrl)
            .reply(200, {access_token: browserAToken}));
        const tokenScopeB = retainScope(nock(config.services.idam.apiUrl)
            .post(oAuth2TokenUrl)
            .reply(200, {access_token: browserBToken}));

        const detailsScope = retainScope(nock(config.services.idam.apiUrl)
            .get('/details')
            .times(4)
            .reply(200, {email: 'same-user@example.com', id: 'idam-user-id', roles: ['probate-private-beta', 'citizen']}));
        const deleteScope = retainScope(nock(config.services.idam.apiUrl)
            .delete(/\/session\/.*/)
            .times(2)
            .reply(200, {name: 'Success'}));

        expect(String(config.singleActiveSession.enabled)).to.equal('true');
        const server = app.init();
        const retainedServer = registerOwnedServer(server.http);
        const agentA = request.agent(retainedServer);
        const agentB = request.agent(retainedServer);
        let testError;
        let cleanupError;
        try {
            const callbackA = await agentA.get(oAuth2CallbackUrl)
                .set('Cookie', `__redirect=${JSON.stringify({state: 'state-A', continue_url: expectedNextUrlForTaskList})}`)
                .query({code: 11111, state: 'state-A'})
                .timeout({deadline: requestTimeoutMs})
                .expect(302);
            const sessionCookieA = getCookieValueFromSetCookie(callbackA.headers['set-cookie'], 'connect.sid');
            const authCookieA = getCookieValueFromSetCookie(callbackA.headers['set-cookie'], IDAM_ACCESS_TOKEN_COOKIE);
            expect(sessionCookieA).to.be.a('string');
            expect(authCookieA).to.be.a('string');

            protectedARequest = agentA.get(expectedNextUrlForTaskList)
                .set('Cookie', authCookieA)
                .timeout({deadline: requestTimeoutMs});
            protectedAResponsePromise = protectedARequest.expect(302)
                .then(res => {
                    protectedASettled = true;
                    return res;
                })
                .catch(err => {
                    protectedASettled = true;
                    throw err;
                });
            protectedAResponsePromise.catch(() => undefined);

            await waitForPendingValidation(1000);

            const callbackB = await agentB.get(oAuth2CallbackUrl)
                .set('Cookie', `__redirect=${JSON.stringify({state: 'state-B', continue_url: expectedNextUrlForTaskList})}`)
                .query({code: 22222, state: 'state-B'})
                .timeout({deadline: requestTimeoutMs})
                .expect(302);
            const authCookieB = getCookieValueFromSetCookie(callbackB.headers['set-cookie'], IDAM_ACCESS_TOKEN_COOKIE);
            expect(authCookieB).to.be.a('string');

            releaseValidation();
            const resProtectedA = await awaitWithDeadline(
                protectedAResponsePromise,
                requestTimeoutMs,
                'Timed out waiting for Browser A protected request'
            );

            expect(resProtectedA.headers.location).to.contain(LOGIN_URL);
            expect(activateStub.callCount).to.equal(2);
            const staleInvitePost = await agentA.post('/executors-additional-invite')
                .set('Cookie', `${authCookieA}; ${sessionCookieA}`)
                .type('form')
                .send({_csrf: 'stale-csrf-token', firstName: 'Late', lastName: 'Invite'})
                .timeout({deadline: requestTimeoutMs})
                .expect(303);
            expect(staleInvitePost.headers.location).to.contain(LOGIN_URL);
            sinon.assert.notCalled(additionalInviteSpy);

            const resSessionB = await agentB.get(expectedNextUrlForTaskList)
                .set('Cookie', authCookieB)
                .timeout({deadline: requestTimeoutMs})
                .expect(200);

            expect(resSessionB.headers.location).to.equal(undefined);
            expect(resSessionB.error).to.equal(false);
            expect(tokenScopeA.isDone()).to.equal(true);
            expect(tokenScopeB.isDone()).to.equal(true);
            expect(detailsScope.isDone()).to.equal(true);
            expect(deleteScope.isDone()).to.equal(true);
        } catch (err) {
            testError = err;
        } finally {
            try {
                if (releaseValidation) {
                    releaseValidation();
                }
                if (protectedARequest) {
                    if (!protectedASettled) {
                        protectedARequest.abort();
                    }
                    await awaitWithDeadline(
                        protectedAResponsePromise.catch(() => undefined),
                        ABORT_WAIT_TIMEOUT_MS,
                        'Timed out awaiting Browser A protected request after abort'
                    );
                }
            } catch (err) {
                cleanupError = cleanupError || err;
            } finally {
                try {
                    additionalInviteSpy.restore();
                } catch (err) {
                    cleanupError = cleanupError || err;
                }
                try {
                    activateStub.restore();
                    validateCurrentOwnerAndRefreshTtlStub.restore();
                } catch (err) {
                    cleanupError = cleanupError || err;
                } finally {
                    config.app.useIDAM = originalUseIDAM;
                    config.app.useCSRFProtection = originalUseCSRFProtection;
                }
            }
        }
        if (testError) {
            throw testError;
        }
        if (cleanupError) {
            throw cleanupError;
        }
    }).timeout(8000);

    function getCookieValueFromSetCookie(setCookieHeader, cookieName) {
        const cookieEntries = Array.isArray(setCookieHeader) ? setCookieHeader : [];
        const cookie = cookieEntries.find(entry => entry.startsWith(`${cookieName}=`));
        return cookie ? cookie.split(';')[0] : undefined;
    }

    function expectCookieExpired(setCookieHeader, cookieName) {
        const cookieEntries = Array.isArray(setCookieHeader) ? setCookieHeader : [];
        const cookie = cookieEntries.find(entry => entry.startsWith(`${cookieName}=`));
        expect(cookie).to.be.a('string');
        expect(cookie).to.contain('Expires=Thu, 01 Jan 1970');
    }

    function getCsrfTokenFromPage(body) {
        const match = /csrfToken:\s*'([^']+)'/.exec(body);
        expect(match, 'expected csrfToken in page scripts').to.not.equal(null);
        return match[1];
    }
});
