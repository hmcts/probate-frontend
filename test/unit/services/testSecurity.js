/* eslint-disable max-lines */
'use strict';

const chai = require('chai');
const sinon = require('sinon');
const when = require('when');
const sinonChai = require('sinon-chai');
const rewire = require('rewire');
const proxyquire = require('proxyquire');
const NodeCache = require('node-cache');
const SessionOwnershipStatusEnum = require('app/utils/SessionOwnershipStatusEnum');
const SessionCleanupOutcomeEnum = require('app/utils/SessionCleanupOutcomeEnum');
const Security = rewire('app/services/Security');
const expect = chai.expect;

chai.use(sinonChai);

describe('Security component', () => {
    const role = 'probate-private-beta';
    const loginUrl = 'http://localhost:8000/login';
    const timeoutUrl = '/time-out';
    const loginUrlWithContinue = `${loginUrl}?ui_locales=cy&response_type=code&state=57473&client_id=ccd_gateway&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth2%2Fcallback`;
    const token = 'dummyToken';
    const appConfig = require('config');
    const IDAM_ACCESS_TOKEN_COOKIE = `__auth-token-${appConfig.payloadVersion}`;
    const expressSessionCookie = appConfig.redis?.cookie?.name || 'connect.sid';
    const expiresTime = new Date() + 999999;
    const expiresTimeInThePast = Date.now() - 1;

    it('passes dedicated session-concurrency config to SessionConcurrency constructor', () => {
        let capturedOptions;
        const revert = Security.__set__('SessionConcurrency', class {
            constructor(options) {
                capturedOptions = options;
            }
        });

        // eslint-disable-next-line no-new
        new Security(loginUrl);

        expect(capturedOptions).to.deep.equal({
            singleActiveSessionEnabled: appConfig.singleActiveSession && appConfig.singleActiveSession.enabled,
            mappingTtl: appConfig.singleActiveSession && appConfig.singleActiveSession.mappingTtl,
            redisEnabled: appConfig.redis && appConfig.redis.enabled
        });
        revert();
    });

    describe('IDAM caching', () => {
        let security;
        let protectAuthenticatedRoute;
        let req;
        let next;
        let res;

        beforeEach(() => {
            req = {
                cookies: [],
                method: 'GET',
                path: '/secure-path',
                query: {
                    state: 'testState',
                    code: '123'
                },
                session: {
                    language: 'cy',
                    form: {
                        caseType: 'gop'
                    },
                    regId: 'regid123',
                    expires: expiresTime
                },
                get: sinon.stub().returns('localhost:3000')
            };
            req.cookies[IDAM_ACCESS_TOKEN_COOKIE] = token;
            res = {
                render: sinon.spy(),
                redirect: sinon.spy(),
                status: sinon.spy(),
                cookie: sinon.spy(),
                clearCookie: sinon.spy()
            };
            next = sinon.spy();
        });

        it('should create a node cache if IDAM caching is enabled', () => {
            const SecurityStub = proxyquire('app/services/Security', {'config': {'services': {'idam': {'caching': 'true'}}}});
            security = new SecurityStub(loginUrl);
            expect(security.idamDetailsCache instanceof NodeCache).to.equal(true);
        });

        it('should handle successful IDAM response when cached', (done) => {
            const nodeCacheGetStub = sinon.stub().returns({
                email: 'cached-user@example.com',
                id: 'immutable-idam-user-id',
                roles: ['citizen']
            });
            const SecurityStub = proxyquire('app/services/Security', {
                'config': {'services': {'idam': {'caching': 'true'}}},
                'node-cache': sinon.stub().callsFake(() => {
                    return {get: nodeCacheGetStub};
                })
            });
            security = new SecurityStub(loginUrl);

            const handleSuccessfulIdamDetailsResponseStub = sinon.stub();
            const hasAuthorisedRoleStub = sinon.stub().returns(true);
            security._storeAuthenticatedUserInSession = handleSuccessfulIdamDetailsResponseStub;
            security._hasAuthorisedRole = hasAuthorisedRoleStub;
            security._getSessionOwnershipStatus = sinon.stub().resolves(SessionOwnershipStatusEnum.getCurrent());
            req.sessionID = 'current-session-id';
            req.sessionStore = {};

            protectAuthenticatedRoute = security.protectAuthenticatedRoute(role);
            protectAuthenticatedRoute(req, res, next);
            checkAsync(() => {
                expect(handleSuccessfulIdamDetailsResponseStub.calledOnce).to.equal(true);
                expect(hasAuthorisedRoleStub.calledOnce).to.equal(true);
                done();
            });
        });

        it('should cache IDAM response if not already cached', (done) => {
            const promise = when({name: 'Success'});
            const cacheSetStub = sinon.stub();
            const SecurityStub = proxyquire('app/services/Security', {
                'config': {'services': {'idam': {'caching': 'true'}}},
                'node-cache': sinon.stub().callsFake(() => {
                    return {get: sinon.stub().returns(), set: cacheSetStub};
                }),
                'app/services/IdamSession': sinon.stub().callsFake(() => {
                    return {get: sinon.stub().returns(promise)};
                })
            });

            security = new SecurityStub(loginUrl);
            security._storeAuthenticatedUserInSession = sinon.stub();
            security._hasAuthorisedRole = sinon.stub().returns(true);

            protectAuthenticatedRoute = security.protectAuthenticatedRoute(role);
            protectAuthenticatedRoute(req, res, next);

            promise
                .then(() => {
                    expect(cacheSetStub.calledOnce).to.equal(true);
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });
    });

    describe('protect', () => {
        let security;
        let protectAuthenticatedRoute;
        let guardPublicScreenerSession;
        let callBackEndpoint;
        let req;
        let res;
        let next;
        let rewireRestorers;
        let originalRewireSet;

        beforeEach(() => {
            rewireRestorers = [];
            originalRewireSet = Security.__set__;
            Security.__set__ = (...args) => {
                const rawRestorer = originalRewireSet(...args);
                const trackedRestorer = () => {
                    if (trackedRestorer.restored) {
                        return;
                    }
                    trackedRestorer.restored = true;
                    rawRestorer();
                };
                trackedRestorer.restored = false;
                rewireRestorers.push(trackedRestorer);
                return trackedRestorer;
            };
            rewireRestorers.push(() => {
                Security.__set__ = originalRewireSet;
            });

            Security.__set__('Oauth2Token', class {
                post() {
                    return Promise.resolve({access_token: token});
                }
            });
            Security.__set__('IdamSession', class {
                get() {
                    return Promise.resolve({
                        email: 'user@example.com',
                        id: 'immutable-idam-user-id',
                        roles: [role, 'citizen']
                    });
                }

                delete() {
                    return Promise.resolve({});
                }
            });

            security = new Security(loginUrl);
            security._generateState = () => {
                return '57473';
            };

            protectAuthenticatedRoute = security.protectAuthenticatedRoute(role);
            guardPublicScreenerSession = security.guardPublicScreenerSession();
            callBackEndpoint = security.handleIdamOAuthCallback();

            req = {
                cookies: [],
                query: {
                    state: 'testState',
                    code: '123'
                },
                session: {
                    language: 'cy',
                    form: {
                        caseType: 'gop'
                    },
                    regId: 'regid123'
                },
                get: sinon.stub().returns('localhost:3000')
            };
            res = {
                render: sinon.spy(),
                redirect: sinon.spy(),
                status: sinon.spy(),
                cookie: sinon.spy(),
                clearCookie: sinon.spy()
            };
            next = sinon.spy();
        });

        afterEach(() => {
            while (rewireRestorers.length > 0) {
                const restore = rewireRestorers.pop();
                restore();
            }
        });

        it('should redirect to login page when security cookie not defined', () => {
            const loggerInfoSpy = sinon.spy();
            const revertLogger = Security.__set__('loggerRaw', () => ({info: loggerInfoSpy, error: sinon.stub(), warn: sinon.stub(), debug: sinon.stub()}));
            const sentinelToken = 'token-secret-123';
            const sentinelSessionId = 'session-id-789';
            const sentinelUserId = 'idam-user-001';
            const sentinelRedisKey = 'redis-key:owner:user';
            const sentinelUrl = 'https://sensitive.example/path?token=abc';
            req.protocol = 'http';
            req.baseUrl = '/';
            req.path = '/start';
            req.method = 'GET';
            req.sessionID = sentinelSessionId;
            req.userId = sentinelUserId;
            req.authToken = sentinelToken;
            req.cookies.redis = sentinelRedisKey;

            protectAuthenticatedRoute(req, res, next);

            sinon.assert.calledOnce(res.redirect);
            expect(res.redirect).to.have.been.calledWith(302, loginUrlWithContinue);
            const messages = getMessages(loggerInfoSpy).join('\n');
            const lifecycleMessagesByEvent = getLifecycleMessagesByEvent(loggerInfoSpy);
            expect(messages).to.contain('event=normal_sign_in_started');
            expect(messages).to.contain('reason=missing_idam_access_token_cookie');
            expect(messages).to.contain('event=idam_sign_in_redirect_issued');
            expect(messages).to.contain('redirectStatus=302');
            expect(messages).to.contain('redirectTarget=idam_login');
            expect(lifecycleMessagesByEvent.normal_sign_in_started).to.contain('requestMethod=GET');
            expect(lifecycleMessagesByEvent.normal_sign_in_started).to.contain('requestPath=/start');
            expect(lifecycleMessagesByEvent.idam_sign_in_redirect_issued).to.contain('requestMethod=GET');
            expect(lifecycleMessagesByEvent.idam_sign_in_redirect_issued).to.contain('requestPath=/start');
            expect(messages).to.not.contain(sentinelToken);
            expect(messages).to.not.contain(sentinelSessionId);
            expect(messages).to.not.contain(sentinelUserId);
            expect(messages).to.not.contain(sentinelRedisKey);
            expect(messages).to.not.contain(sentinelUrl);
            revertLogger();
        });

        it('logs lifecycle requestPath "/" when request URL fields are missing', () => {
            const loggerInfoSpy = sinon.spy();
            const reqWithLoggerOnly = {log: {info: loggerInfoSpy}};

            security._logLifecycle(reqWithLoggerOnly, 'fallback_path_test');

            sinon.assert.calledOnce(loggerInfoSpy);
            const lifecycleMessage = loggerInfoSpy.firstCall.args.join(' ');
            expect(lifecycleMessage).to.contain('event=fallback_path_test');
            expect(lifecycleMessage).to.contain('requestPath=/');
        });

        it('should redirect to login page when cookies null or undefined', () => {
            req.cookies = null;
            req.protocol = 'http';
            req.originalUrl = '/';
            req.baseUrl = '/';

            protectAuthenticatedRoute(req, res, next);

            sinon.assert.calledOnce(res.redirect);
            expect(res.redirect).to.have.been.calledWith(302, loginUrlWithContinue);
        });

        it('should redirect to login page when IDAM session lookup returns Unauthorized', (done) => {
            const loggerInfoSpy = sinon.spy();
            const revertLogger = Security.__set__('loggerRaw', () => ({info: loggerInfoSpy, error: sinon.stub(), warn: sinon.stub(), debug: sinon.stub()}));
            const revert = Security.__set__('IdamSession', class {
                get() {
                    return promise;
                }
            });

            req.session = {language: 'cy', expires: expiresTime};
            req.cookies[IDAM_ACCESS_TOKEN_COOKIE] = token;
            req.protocol = 'http';
            req.baseUrl = '/';
            req.method = 'GET';
            req.path = '/oauth-unauthorized';
            const promise = when({name: 'Error', message: 'Unauthorized'});

            protectAuthenticatedRoute(req, res, next);

            promise
                .then(() => {
                    sinon.assert.calledOnce(res.redirect);
                    expect(res.redirect).to.have.been.calledWith(302, loginUrlWithContinue);
                    const messages = getMessages(loggerInfoSpy).join('\n');
                    expect(messages).to.contain('event=idam_sign_in_redirect_issued');
                    expect(messages).to.contain('redirectStatus=302');
                    revertLogger();
                    revert();
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });

        it('should invalidate stale auth and redirect to login when session is lost', (done) => {
            const loggerInfoSpy = sinon.spy();
            const revertLogger = Security.__set__('loggerRaw', () => ({info: loggerInfoSpy, error: sinon.spy(), warn: sinon.stub(), debug: sinon.stub()}));
            const sentinelState = 'oauth-state-sentinel';
            const sentinelSessionId = 'lost-session-id';
            const sentinelUserId = 'immutable-idam-user-id';
            const sentinelRedisKey = 'redis:owner:sentinel';
            const sentinelUrl = 'https://sensitive.example/return?x=1';
            let settleDelete;
            const deleteStub = sinon.stub().returns(new Promise(resolve => {
                settleDelete = resolve;
            }));
            const destroyStub = sinon.stub().callsFake(callback => {
                delete req.session;
                delete req.sessionStore;
                if (callback) {
                    callback();
                }
            });
            const revert = Security.__set__('IdamSession', class {
                get() {
                    return promise;
                }

                delete(idamAccessToken) {
                    return deleteStub(idamAccessToken);
                }
            });

            req.session = {
                language: 'cy',
                form: {caseType: 'gop'},
                idamUserId: sentinelUserId,
                destroy: destroyStub
            };
            req.sessionStore = {};
            req.sessionID = sentinelSessionId;
            req.cookies[IDAM_ACCESS_TOKEN_COOKIE] = token;
            req.protocol = 'http';
            req.baseUrl = '/';
            req.originalUrl = `/lost-session?state=${sentinelState}`;
            req.path = '/lost-session';
            req.method = 'POST';
            req.authToken = token;
            req.userId = sentinelUserId;
            req.cookies.redis = sentinelRedisKey;
            security.sessionConcurrency = {
                canEnforceSessionOwnership: sinon.stub().throws(new Error('should not be called'))
            };

            protectAuthenticatedRoute(req, res, next);

            checkAsync(() => {
                sinon.assert.notCalled(res.redirect);
                settleDelete({});
            });

            checkAsync(() => {
                sinon.assert.calledOnce(destroyStub);
                sinon.assert.calledOnce(deleteStub);
                sinon.assert.calledWith(deleteStub, token);
                sinon.assert.calledTwice(res.clearCookie);
                sinon.assert.calledWith(res.clearCookie.firstCall, IDAM_ACCESS_TOKEN_COOKIE);
                sinon.assert.calledWith(res.clearCookie.secondCall, expressSessionCookie);
                expect(req.cookies).to.equal(undefined);
                expect(req.session).to.equal(undefined);
                expect(req.sessionID).to.equal(undefined);
                expect(req.sessionStore).to.equal(undefined);
                expect(req.authToken).to.equal(undefined);
                expect(req.userId).to.equal(undefined);
                sinon.assert.calledOnce(res.redirect);
                expect(res.clearCookie.firstCall.callId).to.be.lessThan(res.redirect.firstCall.callId);
                expect(res.clearCookie.secondCall.callId).to.be.lessThan(res.redirect.firstCall.callId);
                expect(res.redirect).to.have.been.calledWith(303, loginUrlWithContinue);
                sinon.assert.notCalled(next);
                sinon.assert.notCalled(security.sessionConcurrency.canEnforceSessionOwnership);
                const messages = getMessages(loggerInfoSpy).join('\n');
                const lifecycleMessagesByEvent = getLifecycleMessagesByEvent(loggerInfoSpy);
                expect(messages).to.contain('event=session_gate_triggered');
                expect(messages).to.contain(`expressSessionStatus=${Security.__get__('SessionStatusEnum').getLost()}`);
                expect(messages).to.contain('event=remote_idam_invalidation_attempted');
                expect(messages).to.contain('event=forced_reauthentication_local_authentication_state_cleared');
                expect(messages).to.contain('event=idam_sign_in_redirect_issued');
                expect(messages).to.contain('redirectStatus=303');
                expect(messages).to.contain('redirectTarget=idam_login');
                expect(lifecycleMessagesByEvent.session_gate_triggered).to.contain('requestMethod=POST');
                expect(lifecycleMessagesByEvent.session_gate_triggered).to.contain('requestPath=/lost-session');
                expect(lifecycleMessagesByEvent.remote_idam_invalidation_attempted).to.contain('requestPath=/lost-session');
                expect(lifecycleMessagesByEvent.forced_reauthentication_local_authentication_state_cleared).to.contain('requestPath=/lost-session');
                expect(lifecycleMessagesByEvent.idam_sign_in_redirect_issued).to.contain('requestPath=/lost-session');
                expect(lifecycleMessagesByEvent.session_gate_triggered).to.not.contain(sentinelState);
                expect(lifecycleMessagesByEvent.remote_idam_invalidation_attempted).to.not.contain(sentinelState);
                expect(lifecycleMessagesByEvent.forced_reauthentication_local_authentication_state_cleared).to.not.contain(sentinelState);
                expect(lifecycleMessagesByEvent.idam_sign_in_redirect_issued).to.not.contain(sentinelState);
                expect(messages).to.not.contain(sentinelState);
                expect(messages).to.not.contain(sentinelSessionId);
                expect(messages).to.not.contain(sentinelUserId);
                expect(messages).to.not.contain(sentinelRedisKey);
                expect(messages).to.not.contain(sentinelUrl);
                revertLogger();
                revert();
                done();
            });
        });

        it('should reauthenticate on public screener POST when IDAM cookie exists and express session is lost', (done) => {
            let settleDelete;
            const deleteStub = sinon.stub().returns(new Promise(resolve => {
                settleDelete = resolve;
            }));
            const destroyStub = sinon.stub().callsFake(callback => {
                delete req.session;
                delete req.sessionStore;
                if (callback) {
                    callback();
                }
            });
            const revert = Security.__set__('IdamSession', class {
                delete(idamAccessToken) {
                    return deleteStub(idamAccessToken);
                }
            });

            req.session = {
                language: 'cy',
                form: {caseType: 'gop'},
                destroy: destroyStub
            };
            req.sessionStore = {};
            req.sessionID = 'lost-session-id';
            req.cookies[IDAM_ACCESS_TOKEN_COOKIE] = token;
            req.protocol = 'http';
            req.baseUrl = '/';
            req.originalUrl = '/death-certificate-english';
            req.path = '/death-certificate-english';
            req.method = 'POST';
            req.authToken = token;
            req.userId = 'immutable-idam-user-id';

            guardPublicScreenerSession(req, res, next);

            checkAsync(() => {
                sinon.assert.notCalled(res.redirect);
                settleDelete({});
            });

            checkAsync(() => {
                sinon.assert.calledOnce(destroyStub);
                sinon.assert.calledOnce(deleteStub);
                sinon.assert.calledWith(deleteStub, token);
                sinon.assert.calledTwice(res.clearCookie);
                sinon.assert.calledWith(res.clearCookie.firstCall, IDAM_ACCESS_TOKEN_COOKIE);
                sinon.assert.calledWith(res.clearCookie.secondCall, expressSessionCookie);
                expect(req.cookies).to.equal(undefined);
                expect(req.session).to.equal(undefined);
                expect(req.sessionID).to.equal(undefined);
                expect(req.sessionStore).to.equal(undefined);
                expect(req.authToken).to.equal(undefined);
                expect(req.userId).to.equal(undefined);
                sinon.assert.calledOnce(res.redirect);
                expect(res.redirect).to.have.been.calledWith(303, loginUrlWithContinue);
                sinon.assert.notCalled(next);
                revert();
                done();
            });
        });

        it('should continue anonymous public screener requests without redirect when IDAM cookie is absent', () => {
            req.cookies = {};
            req.session = undefined;

            guardPublicScreenerSession(req, res, next);

            sinon.assert.calledOnce(next);
            sinon.assert.notCalled(res.redirect);
            sinon.assert.notCalled(res.clearCookie);
        });

        it('should clear stale local auth and continue login when IDAM token invalidation fails', (done) => {
            let rejectDelete;
            const deleteStub = sinon.stub().returns(new Promise((resolve, reject) => {
                rejectDelete = reject;
            }));
            const destroyStub = sinon.stub().callsFake(callback => {
                delete req.session;
                delete req.sessionStore;
                if (callback) {
                    callback();
                }
            });
            const revert = Security.__set__('IdamSession', class {
                get() {
                    return Promise.resolve({name: 'Success'});
                }

                delete(idamAccessToken) {
                    return deleteStub(idamAccessToken);
                }
            });

            req.session = {
                language: 'cy',
                form: {caseType: 'gop'},
                idamUserId: 'immutable-idam-user-id',
                destroy: destroyStub
            };
            req.sessionStore = {};
            req.sessionID = 'lost-session-id';
            req.cookies[IDAM_ACCESS_TOKEN_COOKIE] = token;
            req.protocol = 'http';
            req.baseUrl = '/';
            req.originalUrl = '/';
            req.authToken = token;
            req.userId = 'immutable-idam-user-id';
            security.sessionConcurrency = {
                canEnforceSessionOwnership: sinon.stub().throws(new Error('should not be called'))
            };

            protectAuthenticatedRoute(req, res, next);

            checkAsync(() => {
                sinon.assert.notCalled(res.redirect);
                rejectDelete(new Error('idam failure'));
            });

            checkAsync(() => {
                sinon.assert.calledOnce(destroyStub);
                sinon.assert.calledOnce(deleteStub);
                sinon.assert.calledTwice(res.clearCookie);
                sinon.assert.calledWith(res.clearCookie.firstCall, IDAM_ACCESS_TOKEN_COOKIE);
                sinon.assert.calledWith(res.clearCookie.secondCall, expressSessionCookie);
                expect(req.cookies).to.equal(undefined);
                expect(req.session).to.equal(undefined);
                expect(req.sessionID).to.equal(undefined);
                expect(req.sessionStore).to.equal(undefined);
                expect(req.authToken).to.equal(undefined);
                expect(req.userId).to.equal(undefined);
                sinon.assert.calledOnce(res.redirect);
                expect(res.clearCookie.firstCall.callId).to.be.lessThan(res.redirect.firstCall.callId);
                expect(res.clearCookie.secondCall.callId).to.be.lessThan(res.redirect.firstCall.callId);
                expect(res.redirect).to.have.been.calledWith(302, loginUrlWithContinue);
                sinon.assert.notCalled(next);
                sinon.assert.notCalled(security.sessionConcurrency.canEnforceSessionOwnership);
                revert();
                done();
            });
        });

        it('should clear stale local auth and continue login when IDAM token invalidation resolves with an error payload', (done) => {
            let settleDelete;
            const deleteStub = sinon.stub().returns(new Promise(resolve => {
                settleDelete = resolve;
            }));
            const destroyStub = sinon.stub().callsFake(callback => {
                delete req.session;
                delete req.sessionStore;
                if (callback) {
                    callback();
                }
            });
            const revert = Security.__set__('IdamSession', class {
                get() {
                    return Promise.resolve({name: 'Success'});
                }

                delete(idamAccessToken) {
                    return deleteStub(idamAccessToken);
                }
            });

            req.session = {
                language: 'cy',
                form: {caseType: 'gop'},
                idamUserId: 'immutable-idam-user-id',
                destroy: destroyStub
            };
            req.sessionStore = {};
            req.sessionID = 'lost-session-id';
            req.cookies[IDAM_ACCESS_TOKEN_COOKIE] = token;
            req.protocol = 'http';
            req.baseUrl = '/';
            req.originalUrl = '/';
            req.authToken = token;
            req.userId = 'immutable-idam-user-id';
            security.sessionConcurrency = {
                canEnforceSessionOwnership: sinon.stub().throws(new Error('should not be called'))
            };
            security._hasAuthorisedRole = sinon.stub().throws(new Error('should not be called'));

            protectAuthenticatedRoute(req, res, next);

            checkAsync(() => {
                sinon.assert.notCalled(res.redirect);
                settleDelete(new Error('IDAM 401 empty response'));
            });

            checkAsync(() => {
                sinon.assert.calledOnce(destroyStub);
                sinon.assert.calledOnce(deleteStub);
                sinon.assert.calledTwice(res.clearCookie);
                sinon.assert.calledWith(res.clearCookie.firstCall, IDAM_ACCESS_TOKEN_COOKIE);
                sinon.assert.calledWith(res.clearCookie.secondCall, expressSessionCookie);
                expect(req.cookies).to.equal(undefined);
                expect(req.session).to.equal(undefined);
                expect(req.sessionID).to.equal(undefined);
                expect(req.sessionStore).to.equal(undefined);
                expect(req.authToken).to.equal(undefined);
                expect(req.userId).to.equal(undefined);
                sinon.assert.calledOnce(res.redirect);
                expect(res.clearCookie.firstCall.callId).to.be.lessThan(res.redirect.firstCall.callId);
                expect(res.clearCookie.secondCall.callId).to.be.lessThan(res.redirect.firstCall.callId);
                expect(res.redirect).to.have.been.calledWith(302, loginUrlWithContinue);
                expect(res.redirect.firstCall.args[0]).to.not.equal(timeoutUrl);
                sinon.assert.notCalled(next);
                sinon.assert.notCalled(security.sessionConcurrency.canEnforceSessionOwnership);
                sinon.assert.notCalled(security._hasAuthorisedRole);
                revert();
                done();
            });
        });

        it('should clear auth and session cookies and continue login when lost-session destroy fails', (done) => {
            let settleDelete;
            const deleteStub = sinon.stub().returns(new Promise(resolve => {
                settleDelete = resolve;
            }));
            const destroyStub = sinon.stub().callsFake(callback => {
                callback(new Error('session destroy failed'));
            });
            const revert = Security.__set__('IdamSession', class {
                get() {
                    return Promise.resolve({name: 'Success'});
                }

                delete(idamAccessToken) {
                    return deleteStub(idamAccessToken);
                }
            });

            req.session = {
                language: 'cy',
                form: {caseType: 'gop'},
                idamUserId: 'immutable-idam-user-id',
                destroy: destroyStub
            };
            req.sessionStore = {};
            req.sessionID = 'lost-session-id';
            req.cookies[IDAM_ACCESS_TOKEN_COOKIE] = token;
            req.protocol = 'http';
            req.baseUrl = '/';
            req.originalUrl = '/';
            req.authToken = token;
            req.userId = 'immutable-idam-user-id';
            security.sessionConcurrency = {
                canEnforceSessionOwnership: sinon.stub().throws(new Error('should not be called'))
            };

            protectAuthenticatedRoute(req, res, next);

            checkAsync(() => {
                sinon.assert.notCalled(res.redirect);
                settleDelete({});
            });

            checkAsync(() => {
                sinon.assert.calledOnce(destroyStub);
                sinon.assert.calledOnce(deleteStub);
                sinon.assert.calledTwice(res.clearCookie);
                sinon.assert.calledWith(res.clearCookie.firstCall, IDAM_ACCESS_TOKEN_COOKIE);
                sinon.assert.calledWith(res.clearCookie.secondCall, expressSessionCookie);
                expect(req.cookies).to.equal(undefined);
                expect(req.session).to.equal(undefined);
                expect(req.sessionID).to.equal(undefined);
                expect(req.sessionStore).to.equal(undefined);
                expect(req.authToken).to.equal(undefined);
                expect(req.userId).to.equal(undefined);
                sinon.assert.calledOnce(res.redirect);
                expect(res.clearCookie.firstCall.callId).to.be.lessThan(res.redirect.firstCall.callId);
                expect(res.clearCookie.secondCall.callId).to.be.lessThan(res.redirect.firstCall.callId);
                expect(res.redirect).to.have.been.calledWith(302, loginUrlWithContinue);
                sinon.assert.notCalled(next);
                sinon.assert.notCalled(security.sessionConcurrency.canEnforceSessionOwnership);
                revert();
                done();
            });
        });

        it('should redirect to time-out page when session has expired', (done) => {
            const loggerInfoSpy = sinon.spy();
            const revertLogger = Security.__set__('loggerRaw', () => ({info: loggerInfoSpy, error: sinon.spy(), warn: sinon.stub(), debug: sinon.stub()}));
            const sentinelSessionId = 'expired-session-id';
            const sentinelToken = 'token-sentinel';
            const revert = Security.__set__('IdamSession', class {
                get() {
                    return promise;
                }
            });

            req.session = {expires: expiresTimeInThePast};
            req.cookies[IDAM_ACCESS_TOKEN_COOKIE] = token;
            req.protocol = 'http';
            req.method = 'GET';
            req.path = '/expired';
            req.sessionID = sentinelSessionId;
            req.authToken = sentinelToken;
            const promise = when({name: 'Success'});

            protectAuthenticatedRoute(req, res, next);

            promise
                .then(() => {
                    sinon.assert.calledOnce(res.redirect);
                    expect(res.redirect).to.have.been.calledWith(timeoutUrl);
                    sinon.assert.calledTwice(res.clearCookie);
                    sinon.assert.calledWith(res.clearCookie.firstCall, IDAM_ACCESS_TOKEN_COOKIE);
                    sinon.assert.calledWith(res.clearCookie.secondCall, expressSessionCookie);
                    const messages = getMessages(loggerInfoSpy).join('\n');
                    expect(messages).to.contain('event=session_gate_triggered');
                    expect(messages).to.contain('event=timeout_redirect_issued');
                    expect(messages).to.contain(`expressSessionStatus=${Security.__get__('SessionStatusEnum').getExpired()}`);
                    expect(messages).to.contain('requestMethod=GET');
                    expect(messages).to.contain('requestPath=/expired');
                    expect(messages).to.not.contain(sentinelSessionId);
                    expect(messages).to.not.contain(sentinelToken);
                    revertLogger();
                    revert();
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });

        it('passes unexpected session-status values to next(error) without authorising or redirecting', (done) => {
            req.session = {expires: expiresTime};
            req.cookies[IDAM_ACCESS_TOKEN_COOKIE] = token;
            req.protocol = 'http';

            security._getExpressSessionStatus = sinon.stub().returns('UNKNOWN');
            security._hasAuthorisedRole = sinon.stub();
            security._authoriseActiveSessionRequest = sinon.stub();

            protectAuthenticatedRoute(req, res, next);

            checkAsync(() => {
                sinon.assert.calledOnce(next);
                expect(next.firstCall.args[0]).to.be.instanceOf(Error);
                expect(next.firstCall.args[0].message).to.contain('Unexpected express-session status');
                sinon.assert.notCalled(security._authoriseActiveSessionRequest);
                sinon.assert.notCalled(security._hasAuthorisedRole);
                sinon.assert.notCalled(res.redirect);
                done();
            });
        });

        it('should invalidate stale auth and redirect to login when the session is superseded by a newer login', (done) => {
            const sentinel = 'https://sensitive.example/token';
            const sentinelState = 'oauth-state-super';
            const sentinelSessionId = 'stale-session-id';
            const sentinelUserId = 'immutable-idam-user-id';
            const sentinelRedisKey = 'redis:owner:super';
            const loggerErrorSpy = sinon.spy();
            const loggerInfoSpy = sinon.spy();
            const revertLogger = Security.__set__('loggerRaw', () => ({info: loggerInfoSpy, error: loggerErrorSpy, warn: sinon.stub(), debug: sinon.stub()}));
            const deleteStub = sinon.stub().resolves({});
            const destroyStub = sinon.stub().callsFake(callback => {
                delete req.session;
                delete req.sessionStore;
                if (callback) {
                    callback();
                }
            });
            req.session = {
                expires: expiresTime,
                regId: 'regid123',
                language: 'cy',
                form: {caseType: 'gop'},
                destroy: destroyStub
            };
            req.sessionID = sentinelSessionId;
            const sessionStore = {destroy: sinon.stub()};
            req.sessionStore = sessionStore;
            req.cookies[IDAM_ACCESS_TOKEN_COOKIE] = token;
            req.protocol = 'http';
            req.baseUrl = '/';
            req.originalUrl = `/ownership-check?state=${sentinelState}`;
            req.method = 'GET';
            req.path = '/ownership-check';
            req.authToken = token;
            req.userId = sentinelUserId;
            req.cookies.redis = sentinelRedisKey;

            const revert = Security.__set__('IdamSession', class {
                get() {
                    return Promise.resolve({
                        email: 'user@example.com',
                        id: 'immutable-idam-user-id',
                        roles: [role, 'citizen']
                    });
                }

                delete(idamAccessToken) {
                    return deleteStub(idamAccessToken);
                }
            });

            security.sessionConcurrency = {
                validateCurrentOwnerAndRefreshTtl: sinon.stub().resolves(SessionOwnershipStatusEnum.getSuperseded()),
                activateLatestSession: sinon.stub().resolves()
            };

            protectAuthenticatedRoute(req, res, next);

            checkAsync(() => {
                sinon.assert.calledWith(security.sessionConcurrency.validateCurrentOwnerAndRefreshTtl, sessionStore, 'immutable-idam-user-id', 'stale-session-id');
                sinon.assert.notCalled(security.sessionConcurrency.activateLatestSession);
                sinon.assert.calledOnce(destroyStub);
                sinon.assert.calledOnce(deleteStub);
                sinon.assert.calledWith(deleteStub, token);
                sinon.assert.calledTwice(res.clearCookie);
                sinon.assert.calledWith(res.clearCookie.firstCall, IDAM_ACCESS_TOKEN_COOKIE);
                sinon.assert.calledWith(res.clearCookie.secondCall, expressSessionCookie);
                sinon.assert.calledOnce(res.redirect);
                expect(res.clearCookie.firstCall.callId).to.be.lessThan(res.redirect.firstCall.callId);
                expect(res.clearCookie.secondCall.callId).to.be.lessThan(res.redirect.firstCall.callId);
                expect(res.redirect).to.have.been.calledWith(302, loginUrlWithContinue);
                expect(req.session).to.equal(undefined);
                expect(req.sessionID).to.equal(undefined);
                expect(req.sessionStore).to.equal(undefined);
                expect(req.authToken).to.equal(undefined);
                expect(req.userId).to.equal(undefined);
                sinon.assert.notCalled(next);
                const messages = loggerErrorSpy.getCalls().map(call => call.args.join(' ')).join('\n');
                expect(messages).to.contain('Session ownership status is SUPERSEDED, redirecting user to login for reauthentication.');
                expect(messages).to.not.contain(sentinel);
                const lifecycleMessages = getMessages(loggerInfoSpy).join('\n');
                const lifecycleMessagesByEvent = getLifecycleMessagesByEvent(loggerInfoSpy);
                expect(lifecycleMessages).to.contain('event=session_ownership_reauthentication');
                expect(lifecycleMessages).to.contain(`ownershipStatus=${SessionOwnershipStatusEnum.getSuperseded()}`);
                expect(lifecycleMessages).to.contain('event=forced_reauthentication_local_authentication_state_cleared');
                expect(lifecycleMessages).to.contain('event=idam_sign_in_redirect_issued');
                expect(lifecycleMessages).to.contain('redirectTarget=idam_login');
                expect(lifecycleMessagesByEvent.session_ownership_reauthentication).to.contain('requestMethod=GET');
                expect(lifecycleMessagesByEvent.session_ownership_reauthentication).to.contain('requestPath=/ownership-check');
                expect(lifecycleMessagesByEvent.forced_reauthentication_local_authentication_state_cleared).to.contain('requestPath=/ownership-check');
                expect(lifecycleMessagesByEvent.idam_sign_in_redirect_issued).to.contain('requestPath=/ownership-check');
                expect(lifecycleMessagesByEvent.session_ownership_reauthentication).to.not.contain(sentinelState);
                expect(lifecycleMessagesByEvent.forced_reauthentication_local_authentication_state_cleared).to.not.contain(sentinelState);
                expect(lifecycleMessagesByEvent.idam_sign_in_redirect_issued).to.not.contain(sentinelState);
                expect(lifecycleMessages).to.not.contain(sentinelState);
                expect(lifecycleMessages).to.not.contain(sentinelSessionId);
                expect(lifecycleMessages).to.not.contain(sentinelUserId);
                expect(lifecycleMessages).to.not.contain(sentinelRedisKey);
                expect(lifecycleMessages).to.not.contain(sentinel);
                revert();
                revertLogger();
                done();
            });
        });

        it('stores immutable IDAM ID separately from email registration ID', () => {
            req.session = {};

            security._storeAuthenticatedUserInSession(req, {
                email: 'applicant@example.com',
                id: 'immutable-idam-user-id'
            }, token);

            expect(req.session.regId).to.equal('applicant@example.com');
            expect(req.session.idamUserId).to.equal('immutable-idam-user-id');
            expect(req.userId).to.equal('immutable-idam-user-id');
        });

        it('authorises a protected request only after ownership validation succeeds', (done) => {
            req.session = {expires: expiresTime, language: 'en'};
            req.sessionID = 'current-session-id';
            req.sessionStore = {};
            req.cookies[IDAM_ACCESS_TOKEN_COOKIE] = token;
            req.protocol = 'http';
            security.sessionConcurrency = {
                validateCurrentOwnerAndRefreshTtl: sinon.stub().resolves(SessionOwnershipStatusEnum.getCurrent()),
                activateLatestSession: sinon.stub().resolves()
            };

            protectAuthenticatedRoute(req, res, next);

            checkAsync(() => {
                sinon.assert.calledWith(security.sessionConcurrency.validateCurrentOwnerAndRefreshTtl, req.sessionStore, 'immutable-idam-user-id', 'current-session-id');
                sinon.assert.notCalled(security.sessionConcurrency.activateLatestSession);
                sinon.assert.calledOnceWithExactly(next);
                done();
            });
        });

        it('continues authorisation when ownership enforcement is disabled and idamUserId is missing', (done) => {
            req.session = {expires: expiresTime, language: 'en'};
            req.sessionID = 'current-session-id';
            req.sessionStore = {};
            req.cookies[IDAM_ACCESS_TOKEN_COOKIE] = token;
            req.protocol = 'http';
            security._getIdamDetails = sinon.stub().resolves({roles: [role]});
            security._reauthenticateUser = sinon.stub().resolves(false);
            security._hasAuthorisedRole = sinon.stub().returns(true);
            security.sessionConcurrency = {
                validateCurrentOwnerAndRefreshTtl: sinon.stub().resolves(SessionOwnershipStatusEnum.getNotEnforced()),
                activateLatestSession: sinon.stub().resolves()
            };

            protectAuthenticatedRoute(req, res, next);

            checkAsync(() => {
                sinon.assert.calledWith(security.sessionConcurrency.validateCurrentOwnerAndRefreshTtl, req.sessionStore, undefined, 'current-session-id');
                sinon.assert.notCalled(security._reauthenticateUser);
                sinon.assert.calledWith(security._hasAuthorisedRole, [role], role);
                sinon.assert.calledOnceWithExactly(next);
                done();
            });
        });

        it('reauthenticates when ownership status is unverifiable and does not continue role authorisation', (done) => {
            const sentinel = 'redis://sensitive/key/token';
            const loggerErrorSpy = sinon.spy();
            const loggerInfoSpy = sinon.spy();
            const revertLogger = Security.__set__('loggerRaw', () => ({info: loggerInfoSpy, error: loggerErrorSpy, warn: sinon.stub(), debug: sinon.stub()}));
            req.session = {expires: expiresTime, language: 'en'};
            req.sessionID = 'current-session-id';
            req.sessionStore = {};
            req.cookies[IDAM_ACCESS_TOKEN_COOKIE] = token;
            req.protocol = 'http';
            req.method = 'POST';
            req.path = '/ownership-check';
            security._reauthenticateUser = sinon.stub().resolves(false);
            security._hasAuthorisedRole = sinon.stub().returns(true);
            security.sessionConcurrency = {
                validateCurrentOwnerAndRefreshTtl: sinon.stub().resolves(SessionOwnershipStatusEnum.getUnverifiable()),
                activateLatestSession: sinon.stub().resolves()
            };

            protectAuthenticatedRoute(req, res, next);

            checkAsync(() => {
                sinon.assert.calledWith(security.sessionConcurrency.validateCurrentOwnerAndRefreshTtl, req.sessionStore, 'immutable-idam-user-id', 'current-session-id');
                sinon.assert.calledOnce(security._reauthenticateUser);
                sinon.assert.notCalled(security._hasAuthorisedRole);
                sinon.assert.notCalled(next);
                const messages = loggerErrorSpy.getCalls().map(call => call.args.join(' ')).join('\n');
                expect(messages).to.contain('Session ownership status is UNVERIFIABLE, redirecting user to login for reauthentication.');
                expect(messages).to.not.contain(sentinel);
                const lifecycleMessages = getMessages(loggerInfoSpy).join('\n');
                expect(lifecycleMessages).to.contain('event=session_ownership_reauthentication');
                expect(lifecycleMessages).to.contain(`ownershipStatus=${SessionOwnershipStatusEnum.getUnverifiable()}`);
                expect(lifecycleMessages).to.contain('requestMethod=POST');
                expect(lifecycleMessages).to.contain('requestPath=/ownership-check');
                revertLogger();
                done();
            });
        });

        it('passes unknown ownership statuses to next(error) without reauth, role checks, or redirect', (done) => {
            req.session = {expires: expiresTime, language: 'en'};
            req.sessionID = 'current-session-id';
            req.sessionStore = {};
            req.cookies[IDAM_ACCESS_TOKEN_COOKIE] = token;
            req.protocol = 'http';
            security._reauthenticateUser = sinon.stub().resolves(false);
            security._hasAuthorisedRole = sinon.stub().returns(true);
            security.sessionConcurrency = {
                validateCurrentOwnerAndRefreshTtl: sinon.stub().resolves('UNKNOWN_STATUS'),
                activateLatestSession: sinon.stub().resolves()
            };

            protectAuthenticatedRoute(req, res, next);

            checkAsync(() => {
                sinon.assert.calledOnce(next);
                expect(next.firstCall.args[0]).to.be.instanceOf(Error);
                expect(next.firstCall.args[0].message).to.contain('Unexpected session ownership status');
                sinon.assert.notCalled(security._hasAuthorisedRole);
                sinon.assert.notCalled(security._reauthenticateUser);
                sinon.assert.notCalled(res.redirect);
                done();
            });
        });

        it('persists cached immutable IDAM ID before ownership validation', (done) => {
            req.session = {expires: expiresTime, language: 'en', regId: 'cached-user@example.com'};
            req.sessionID = 'current-session-id';
            req.sessionStore = {};
            req.cookies[IDAM_ACCESS_TOKEN_COOKIE] = token;
            req.protocol = 'http';
            security.idamDetailsCache = {
                get: sinon.stub().withArgs('cached-user@example.com').returns({
                    email: 'cached-user@example.com',
                    id: 'cached-immutable-id',
                    roles: [role]
                })
            };
            security.sessionConcurrency = {
                validateCurrentOwnerAndRefreshTtl: sinon.stub().callsFake(() => {
                    expect(req.session.idamUserId).to.equal('cached-immutable-id');
                    return Promise.resolve(SessionOwnershipStatusEnum.getCurrent());
                }),
                activateLatestSession: sinon.stub().resolves()
            };

            protectAuthenticatedRoute(req, res, next);

            checkAsync(() => {
                sinon.assert.calledWith(security.sessionConcurrency.validateCurrentOwnerAndRefreshTtl, req.sessionStore, 'cached-immutable-id', 'current-session-id');
                expect(req.session.regId).to.equal('cached-user@example.com');
                sinon.assert.calledOnceWithExactly(next);
                done();
            });
        });

        it('passes ownership validation failures to next and cannot fall through to authorisation', (done) => {
            const redisError = new Error('redis failed');
            req.session = {expires: expiresTime, language: 'cy'};
            req.sessionID = 'current-session-id';
            req.sessionStore = {};
            req.cookies[IDAM_ACCESS_TOKEN_COOKIE] = token;
            req.protocol = 'http';
            security.sessionConcurrency = {
                validateCurrentOwnerAndRefreshTtl: sinon.stub().rejects(redisError),
                activateLatestSession: sinon.stub().resolves()
            };

            protectAuthenticatedRoute(req, res, next);

            checkAsync(() => {
                sinon.assert.calledOnce(next);
                sinon.assert.calledWithExactly(next, redisError);
                sinon.assert.notCalled(res.redirect);
                sinon.assert.notCalled(res.clearCookie);
                done();
            });
        });

        it('passes role-check errors to next once after ownership validation succeeds', (done) => {
            const authorizeError = new Error('role check failed');
            req.session = {expires: expiresTime, language: 'en'};
            req.sessionID = 'current-session-id';
            req.sessionStore = {};
            req.cookies[IDAM_ACCESS_TOKEN_COOKIE] = token;
            req.protocol = 'http';
            security.sessionConcurrency = {
                validateCurrentOwnerAndRefreshTtl: sinon.stub().resolves(SessionOwnershipStatusEnum.getCurrent()),
                activateLatestSession: sinon.stub().resolves()
            };
            security._hasAuthorisedRole = sinon.stub().throws(authorizeError);

            protectAuthenticatedRoute(req, res, next);

            checkAsync(() => {
                sinon.assert.calledOnce(next);
                sinon.assert.calledWithExactly(next, authorizeError);
                sinon.assert.notCalled(res.render);
                sinon.assert.notCalled(res.redirect);
                done();
            });
        });

        it('passes IDAM session lookup rejections to next once without extra redirects', (done) => {
            const getError = new Error('idam get failed');
            const revert = Security.__set__('IdamSession', class {
                get() {
                    return Promise.reject(getError);
                }
            });

            req.session = {expires: expiresTime, language: 'en'};
            req.sessionID = 'current-session-id';
            req.sessionStore = {};
            req.cookies[IDAM_ACCESS_TOKEN_COOKIE] = token;
            req.protocol = 'http';

            protectAuthenticatedRoute(req, res, next);

            checkAsync(() => {
                sinon.assert.calledOnce(next);
                sinon.assert.calledWithExactly(next, getError);
                sinon.assert.notCalled(res.render);
                sinon.assert.notCalled(res.redirect);
                revert();
                done();
            });
        });

        it('passes validation-chain rejections to next once and does not authorise', (done) => {
            const chainError = new Error('reauth chain failed');
            req.session = {expires: expiresTime, language: 'en'};
            req.sessionID = 'current-session-id';
            req.sessionStore = {};
            req.cookies[IDAM_ACCESS_TOKEN_COOKIE] = token;
            req.protocol = 'http';

            security._hasAuthorisedRole = sinon.stub();
            security._getSessionOwnershipStatus = sinon.stub().rejects(chainError);

            protectAuthenticatedRoute(req, res, next);

            checkAsync(() => {
                sinon.assert.calledOnce(next);
                sinon.assert.calledWithExactly(next, chainError);
                sinon.assert.notCalled(security._hasAuthorisedRole);
                sinon.assert.notCalled(res.render);
                sinon.assert.notCalled(res.redirect);
                done();
            });
        });

        it('keeps local cleanup and sign-in when stale-token invalidation fails', (done) => {
            const sentinel = 'https://idam.local/session/token-secret-123';
            const sentinelState = 'oauth-state-sentinel';
            const loggerErrorSpy = sinon.spy();
            const loggerInfoSpy = sinon.spy();
            const revertLogger = Security.__set__('loggerRaw', () => ({info: loggerInfoSpy, error: loggerErrorSpy, debug: sinon.stub()}));
            const revert = Security.__set__('IdamSession', class {
                delete() {
                    const err = new Error(`contains ${sentinel}`);
                    err.name = 'IdamDeleteError';
                    err.statusCode = 503;
                    return Promise.reject(err);
                }
            });

            req.session = {
                language: 'cy',
                destroy: callback => callback()
            };
            req.cookies[IDAM_ACCESS_TOKEN_COOKIE] = token;
            req.log = {info: loggerInfoSpy, error: loggerErrorSpy, debug: sinon.stub()};
            req.baseUrl = '/';
            req.originalUrl = `/reauth?state=${sentinelState}`;
            req.protocol = 'http';
            req.method = 'POST';
            req.path = '/';

            security._reauthenticateUser(req, res).then(() => {
                const messages = loggerErrorSpy.getCalls().map(call => call.args.join(' ')).join('\n');
                expect(messages).to.contain('Unable to invalidate stale IDAM session token. (statusCode: 503)');
                expect(messages).to.not.contain(sentinel);
                const lifecycleMessages = getMessages(loggerInfoSpy).join('\n');
                const lifecycleMessagesByEvent = getLifecycleMessagesByEvent(loggerInfoSpy);
                expect(lifecycleMessages).to.contain('event=remote_idam_invalidation_attempted');
                expect(lifecycleMessages).to.contain('event=forced_reauthentication_local_authentication_state_cleared');
                expect(lifecycleMessages).to.contain(`expressSessionDestructionOutcome=${SessionCleanupOutcomeEnum.getCompleted()}`);
                expect(lifecycleMessages).to.contain('event=idam_sign_in_redirect_issued');
                expect(lifecycleMessages).to.contain('redirectTarget=idam_login');
                expect(lifecycleMessagesByEvent.remote_idam_invalidation_attempted).to.contain('requestMethod=POST');
                expect(lifecycleMessagesByEvent.remote_idam_invalidation_attempted).to.contain('requestPath=/reauth');
                expect(lifecycleMessagesByEvent.forced_reauthentication_local_authentication_state_cleared).to.contain('requestPath=/reauth');
                expect(lifecycleMessagesByEvent.idam_sign_in_redirect_issued).to.contain('requestPath=/reauth');
                expect(lifecycleMessagesByEvent.remote_idam_invalidation_attempted).to.not.contain(sentinelState);
                expect(lifecycleMessagesByEvent.forced_reauthentication_local_authentication_state_cleared).to.not.contain(sentinelState);
                expect(lifecycleMessagesByEvent.idam_sign_in_redirect_issued).to.not.contain(sentinelState);
                expect(lifecycleMessages).to.not.contain(sentinelState);
                revert();
                revertLogger();
                done();
            }).catch(done);
        });

        it('passes ownership validation errors through to technical error handling', (done) => {
            const sentinel = 'redis://user:token@localhost:6379/0';
            const validationError = new Error(`boom ${sentinel}`);
            validationError.name = 'RedisConnectionError';
            req.session = {
                expires: expiresTime,
                idamUserId: 'immutable-idam-user-id',
                language: 'cy'
            };
            req.sessionID = 'current-session-id';
            req.sessionStore = {};
            req.cookies[IDAM_ACCESS_TOKEN_COOKIE] = token;
            security.sessionConcurrency = {
                validateCurrentOwnerAndRefreshTtl: sinon.stub().rejects(validationError),
                activateLatestSession: sinon.stub().resolves()
            };

            protectAuthenticatedRoute(req, res, next);

            checkAsync(() => {
                sinon.assert.calledOnce(next);
                sinon.assert.calledWithExactly(next, validationError);
                sinon.assert.notCalled(res.redirect);
                done();
            });
        });

        it('keeps local cleanup and sign-in when superseded-session destruction fails', (done) => {
            const sentinel = 'token-secret-redirect-url';
            const loggerErrorSpy = sinon.spy();
            const loggerInfoSpy = sinon.spy();
            const revertLogger = Security.__set__('loggerRaw', () => ({info: loggerInfoSpy, error: loggerErrorSpy, debug: sinon.stub()}));
            const revert = Security.__set__('IdamSession', class {
                delete() {
                    return Promise.resolve({});
                }
            });

            req.session = {
                language: 'cy',
                destroy: callback => {
                    const err = new Error(`contains ${sentinel}`);
                    err.name = 'SessionStoreError';
                    callback(err);
                }
            };
            req.cookies[IDAM_ACCESS_TOKEN_COOKIE] = token;
            req.log = {info: loggerInfoSpy, error: loggerErrorSpy, debug: sinon.stub()};
            req.baseUrl = '/';
            req.originalUrl = '/';
            req.protocol = 'http';
            req.method = 'POST';
            req.path = '/reauth';

            security._reauthenticateUser(req, res).then(() => {
                const messages = loggerErrorSpy.getCalls().map(call => call.args.join(' ')).join('\n');
                expect(messages).to.contain('Unable to destroy superseded local session.');
                expect(messages).to.not.contain(sentinel);
                const lifecycleMessages = getMessages(loggerInfoSpy).join('\n');
                expect(lifecycleMessages).to.contain('event=forced_reauthentication_local_authentication_state_cleared');
                expect(lifecycleMessages).to.contain(`expressSessionDestructionOutcome=${SessionCleanupOutcomeEnum.getFailed()}`);
                expect(lifecycleMessages).to.contain('event=idam_sign_in_redirect_issued');
                revert();
                revertLogger();
                done();
            }).catch(done);
        });

        it('treats resolved Error-style stale-token invalidation as a failure and still signs in', (done) => {
            const loggerErrorSpy = sinon.spy();
            const loggerInfoSpy = sinon.spy();
            const revertLogger = Security.__set__('loggerRaw', () => ({info: loggerInfoSpy, error: loggerErrorSpy, debug: sinon.stub()}));
            const revert = Security.__set__('IdamSession', class {
                delete() {
                    return Promise.resolve({name: 'Error', statusCode: 401});
                }
            });

            req.session = {
                language: 'cy',
                destroy: callback => callback()
            };
            req.cookies[IDAM_ACCESS_TOKEN_COOKIE] = token;
            req.log = {info: loggerInfoSpy, error: loggerErrorSpy, debug: sinon.stub()};
            req.baseUrl = '/';
            req.originalUrl = '/';
            req.protocol = 'http';
            req.method = 'POST';
            req.path = '/reauth';

            security._reauthenticateUser(req, res).then(() => {
                const messages = loggerErrorSpy.getCalls().map(call => call.args.join(' ')).join('\n');
                expect(messages).to.contain('Unable to invalidate stale IDAM session token. (statusCode: 401)');
                const lifecycleMessages = getMessages(loggerInfoSpy).join('\n');
                expect(lifecycleMessages).to.contain('event=forced_reauthentication_local_authentication_state_cleared');
                expect(lifecycleMessages).to.contain(`expressSessionDestructionOutcome=${SessionCleanupOutcomeEnum.getCompleted()}`);
                expect(lifecycleMessages).to.contain('event=idam_sign_in_redirect_issued');
                sinon.assert.calledTwice(res.clearCookie);
                sinon.assert.calledWith(res.clearCookie.firstCall, IDAM_ACCESS_TOKEN_COOKIE);
                sinon.assert.calledWith(res.clearCookie.secondCall, expressSessionCookie);
                expect(req.cookies).to.equal(undefined);
                expect(req.session).to.equal(undefined);
                expect(req.sessionID).to.equal(undefined);
                expect(req.sessionStore).to.equal(undefined);
                expect(req.authToken).to.equal(undefined);
                expect(req.userId).to.equal(undefined);
                sinon.assert.calledOnce(res.redirect);
                expect(res.redirect).to.have.been.calledWith(303, loginUrlWithContinue);
                revert();
                revertLogger();
                done();
            }).catch(done);
        });

        it('logs skipped local session destruction outcome when no Express destroy is available', (done) => {
            const loggerErrorSpy = sinon.spy();
            const loggerInfoSpy = sinon.spy();
            const revertLogger = Security.__set__('loggerRaw', () => ({info: loggerInfoSpy, error: loggerErrorSpy, debug: sinon.stub()}));
            const revert = Security.__set__('IdamSession', class {
                delete() {
                    return Promise.resolve({});
                }
            });

            req.session = {language: 'cy'};
            req.cookies[IDAM_ACCESS_TOKEN_COOKIE] = token;
            req.log = {info: loggerInfoSpy, error: loggerErrorSpy, debug: sinon.stub()};
            req.baseUrl = '/';
            req.originalUrl = '/';
            req.protocol = 'http';
            req.method = 'POST';
            req.path = '/reauth';

            security._reauthenticateUser(req, res).then(() => {
                const lifecycleMessages = getMessages(loggerInfoSpy).join('\n');
                expect(lifecycleMessages).to.contain('event=forced_reauthentication_local_authentication_state_cleared');
                expect(lifecycleMessages).to.contain(`expressSessionDestructionOutcome=${SessionCleanupOutcomeEnum.getSkipped()}`);
                expect(lifecycleMessages).to.contain('event=idam_sign_in_redirect_issued');
                revert();
                revertLogger();
                done();
            }).catch(done);
        });

        it('logs generic activation cleanup failure when previous session destruction fails during callback completion', (done) => {
            const sentinel = 'https://idam.local?token=sensitive';
            const sentinelUserId = 'immutable-idam-user-id';
            const sentinelSessionId = 'session-id';
            const loggerErrorSpy = sinon.spy();
            const loggerInfoSpy = sinon.spy();
            const revertLogger = Security.__set__('loggerRaw', () => ({info: loggerInfoSpy, error: loggerErrorSpy, warn: sinon.stub(), debug: sinon.stub()}));
            const revertIdam = Security.__set__('IdamSession', class {
                get() {
                    return Promise.resolve({
                        email: 'user@example.com',
                        id: sentinelUserId,
                        roles: [role]
                    });
                }
            });
            security.sessionConcurrency = {
                activateLatestSession: sinon.stub().resolves({
                    previousSessionId: 'old-session-id',
                    ownershipStatus: SessionOwnershipStatusEnum.getCurrent(),
                    destroyError: new Error(`oops ${sentinel}`)
                })
            };
            security._getTokenFromCode = sinon.stub().resolves({access_token: token});
            security._setCookie = sinon.stub();
            req.log = {info: loggerInfoSpy, error: loggerErrorSpy, warn: sinon.stub(), debug: sinon.stub()};
            req.session = {language: 'en'};
            req.query = {code: '12345', state: 'testState'};
            req.sessionID = sentinelSessionId;
            req.method = 'GET';
            req.path = '/oauth2/callback';
            req.sessionStore = {};
            const redirectInfo = {state: 'testState', continue_url: '/task-list'};

            security._establishAuthenticatedSession(req, res, redirectInfo).then(() => {
                const messages = loggerErrorSpy.getCalls().map(call => call.args.join(' ')).join('\n');
                expect(messages).to.contain('Unable to destroy previous active session.');
                expect(messages).to.not.contain(sentinel);
                const lifecycleMessages = getMessages(loggerInfoSpy).join('\n');
                expect(lifecycleMessages).to.contain('event=authenticated_login_completed');
                expect(lifecycleMessages).to.contain(`ownershipStatus=${SessionOwnershipStatusEnum.getCurrent()}`);
                expect(lifecycleMessages).to.contain('previousSessionReplaced=true');
                expect(lifecycleMessages).to.contain('requestMethod=GET');
                expect(lifecycleMessages).to.contain('requestPath=/oauth2/callback');
                expect(lifecycleMessages).to.not.contain(sentinelUserId);
                expect(lifecycleMessages).to.not.contain(sentinelSessionId);
                sinon.assert.calledWith(security.sessionConcurrency.activateLatestSession, req.sessionStore, sentinelUserId, sentinelSessionId);
                sinon.assert.calledWith(security._setCookie, res, IDAM_ACCESS_TOKEN_COOKIE, token);
                sinon.assert.calledWith(res.redirect, '/task-list');
                expect(req.session.idamUserId).to.equal(sentinelUserId);
                revertLogger();
                revertIdam();
                done();
            }).catch(done);
        });

        it('logs not-enforced ownership status when callback activation enforcement is disabled', (done) => {
            const loggerInfoSpy = sinon.spy();
            const loggerErrorSpy = sinon.spy();
            const revertLogger = Security.__set__('loggerRaw', () => ({info: loggerInfoSpy, error: loggerErrorSpy, warn: sinon.stub(), debug: sinon.stub()}));
            const revertIdam = Security.__set__('IdamSession', class {
                get() {
                    return Promise.resolve({
                        email: 'user@example.com',
                        id: 'immutable-idam-user-id',
                        roles: [role]
                    });
                }
            });
            security.sessionConcurrency = {
                activateLatestSession: sinon.stub().resolves({
                    previousSessionId: null,
                    ownershipStatus: SessionOwnershipStatusEnum.getNotEnforced()
                })
            };
            security._getTokenFromCode = sinon.stub().resolves({access_token: token});
            security._setCookie = sinon.stub();
            req.log = {info: loggerInfoSpy, error: loggerErrorSpy, warn: sinon.stub(), debug: sinon.stub()};
            req.session = {language: 'en'};
            req.query = {code: '12345', state: 'testState'};
            req.sessionID = 'session-id';
            req.method = 'GET';
            req.path = '/oauth2/callback';
            req.sessionStore = {};
            const redirectInfo = {state: 'testState', continue_url: '/task-list'};

            security._establishAuthenticatedSession(req, res, redirectInfo).then(() => {
                const lifecycleMessages = getMessages(loggerInfoSpy).join('\n');
                expect(lifecycleMessages).to.contain('event=authenticated_login_completed');
                expect(lifecycleMessages).to.contain(`ownershipStatus=${SessionOwnershipStatusEnum.getNotEnforced()}`);
                expect(lifecycleMessages).to.contain('previousSessionReplaced=false');
                sinon.assert.calledWith(security._setCookie, res, IDAM_ACCESS_TOKEN_COOKIE, token);
                sinon.assert.calledWith(res.redirect, '/task-list');
                revertLogger();
                revertIdam();
                done();
            }).catch(done);
        });

        it('should retrieve user details when auth token provided', () => {
            const revert = Security.__set__('IdamSession', class {
                get() {
                    return Promise.resolve({name: 'Error'});
                }
            });
            req.session = {expires: expiresTime, language: 'en'};

            req.cookies[IDAM_ACCESS_TOKEN_COOKIE] = token;

            protectAuthenticatedRoute(req, res, next);
            revert();
        });

        it('should deny access when user roles do not match resource role', (done) => {
            const revert = Security.__set__('IdamSession', class {
                get() {
                    return promise;
                }
            });

            req.session = {expires: expiresTime, language: 'en'};
            req.sessionID = 'current-session-id';
            req.sessionStore = {};
            req.cookies[IDAM_ACCESS_TOKEN_COOKIE] = token;

            const promise = when({
                email: 'user@example.com',
                id: 'immutable-idam-user-id',
                roles: ['CITIZEN', 'ROOT']
            });

            protectAuthenticatedRoute(req, res, next);

            promise
                .then(() => {
                    checkAsync(() => {
                        expect(res.status).to.have.been.calledWith(403);
                        expect(res.render).to.have.been.calledWith('errors/error');
                        revert();
                        done();
                    });
                })
                .catch((err) => {
                    done(err);
                });

        });

        it('should grant access when user roles do match resource role - pa', (done) => {
            const revert = Security.__set__('IdamSession', class {
                get() {
                    return promise;
                }
            });

            req.session = {expires: expiresTime};
            req.sessionID = 'current-session-id';
            req.sessionStore = {};
            req.cookies[IDAM_ACCESS_TOKEN_COOKIE] = token;

            const promise = when({
                email: 'user@example.com',
                id: 'immutable-idam-user-id',
                roles: [role, 'ROOT']
            });

            protectAuthenticatedRoute(req, res, next);

            promise
                .then(() => {
                    checkAsync(() => {
                        expect(next).to.have.been.calledWithExactly();
                        revert();
                        done();
                    });
                })
                .catch((err) => {
                    done(err);
                });
        });

        it('restarts normal sign-in when callback token exchange returns Unauthorized', async () => {
            const revertOauth = Security.__set__('Oauth2Token', class {
                post() {
                    return Promise.resolve({name: 'Error', message: 'Unauthorized'});
                }
            });
            req.protocol = 'http';
            req.baseUrl = '/';
            req.originalUrl = '/';
            req.cookies.__redirect = JSON.stringify({state: 'testState', continue_url: '/continue'});

            await callBackEndpoint(req, res, next);

            sinon.assert.calledOnce(res.redirect);
            expect(res.redirect).to.have.been.calledWith(302, loginUrlWithContinue);
            sinon.assert.notCalled(next);
            revertOauth();
        });

        it('passes unexpected callback token exchange errors to next(error)', async () => {
            const tokenError = {name: 'Error', message: 'forbidden'};
            const revertOauth = Security.__set__('Oauth2Token', class {
                post() {
                    return Promise.resolve(tokenError);
                }
            });
            req.protocol = 'http';
            req.cookies.__redirect = JSON.stringify({state: 'testState', continue_url: '/continue'});

            await callBackEndpoint(req, res, next);

            sinon.assert.calledOnce(next);
            sinon.assert.calledWithExactly(next, tokenError);
            sinon.assert.notCalled(res.render);
            revertOauth();
        });

        it('passes unexpected callback IDAM-details errors to next(error)', async () => {
            const idamError = {name: 'Error', message: 'service unavailable'};
            const revertIdam = Security.__set__('IdamSession', class {
                get() {
                    return Promise.resolve(idamError);
                }

                delete() {
                    return Promise.resolve({});
                }
            });
            req.protocol = 'http';
            req.cookies.__redirect = JSON.stringify({state: 'testState', continue_url: '/continue'});

            await callBackEndpoint(req, res, next);

            sinon.assert.calledOnce(next);
            sinon.assert.calledWithExactly(next, idamError);
            sinon.assert.notCalled(res.render);
            revertIdam();
        });

        it('should make the auth cookie secure if the protocol is http', async () => {
            req.protocol = 'http';
            req.cookies.__redirect = JSON.stringify({state: 'testState', continue_url: '/continue'});
            await callBackEndpoint(req, res, next);

            expect(res.cookie).to.have.been.calledWith(IDAM_ACCESS_TOKEN_COOKIE, token, {secure: true, httpOnly: true});
            expect(res.redirect).to.have.been.calledWith('/continue');
        });

        it('should make the auth cookie secure if the protocol is https', async () => {
            req.protocol = 'https';
            req.cookies.__redirect = JSON.stringify({state: 'testState', continue_url: '/continue'});

            await callBackEndpoint(req, res, next);

            expect(res.cookie).to.have.been.calledWith(IDAM_ACCESS_TOKEN_COOKIE, token, {secure: true, httpOnly: true});
        });

        it('activates latest callback session before setting the authenticated cookie and redirecting', async () => {
            const callOrder = [];
            req.protocol = 'http';
            req.sessionID = 'new-session-id';
            req.sessionStore = {};
            req.cookies.__redirect = JSON.stringify({state: 'testState', continue_url: '/continue'});
            security.sessionConcurrency = {
                activateLatestSession: sinon.stub().callsFake((sessionStore, userId, sessionId) => {
                    callOrder.push('activate');
                    expect(userId).to.equal('immutable-idam-user-id');
                    expect(sessionId).to.equal('new-session-id');
                    return Promise.resolve({
                        previousSessionId: 'old-session-id',
                        ownershipStatus: SessionOwnershipStatusEnum.getCurrent()
                    });
                })
            };
            res.cookie = sinon.stub().callsFake(() => callOrder.push('cookie'));
            res.redirect = sinon.stub().callsFake(() => callOrder.push('redirect'));

            await callBackEndpoint(req, res, next);

            expect(callOrder).to.deep.equal(['activate', 'cookie', 'redirect']);
            sinon.assert.notCalled(next);
        });

        it('passes callback mapping failures to error middleware without setting cookie or redirecting', async () => {
            const redisError = new Error('mapping write failed');
            req.protocol = 'http';
            req.sessionID = 'new-session-id';
            req.sessionStore = {};
            req.cookies.__redirect = JSON.stringify({state: 'testState', continue_url: '/continue'});
            security.sessionConcurrency = {
                activateLatestSession: sinon.stub().rejects(redisError)
            };

            await callBackEndpoint(req, res, next);

            sinon.assert.calledWith(next, redisError);
            sinon.assert.notCalled(res.cookie);
            sinon.assert.notCalled(res.redirect);
        });
    });

    const checkAsync = (callback) => {
        setTimeout(() => {
            callback();
        }, 50);
    };

    const getMessages = (spy) => spy.getCalls().map(call => call.args.join(' '));
    const getLifecycleMessagesByEvent = (spy) => getMessages(spy).reduce((accumulator, message) => {
        const eventMatch = message.match(/(?:^| )event=([^ ]+)/);
        if (eventMatch) {
            accumulator[eventMatch[1]] = message;
        }
        return accumulator;
    }, {});
});
