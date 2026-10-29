/* eslint-disable max-lines */
'use strict';

const chai = require('chai');
const sinon = require('sinon');
const when = require('when');
const sinonChai = require('sinon-chai');
const rewire = require('rewire');
const proxyquire = require('proxyquire');
const NodeCache = require('node-cache');
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
    const securityCookie = `__auth-token-${appConfig.payloadVersion}`;
    const expressSessionCookie = appConfig.redis?.cookie?.name || 'connect.sid';
    const expiresTime = new Date() + 999999;
    const expiresTimeInThePast = Date.now() - 1;

    describe('Idam caching', () => {
        let security;
        let protect;
        let req;
        let next;
        let res;

        beforeEach(() => {
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
                    regId: 'regid123',
                    expires: expiresTime
                },
                get: sinon.stub().returns('localhost:3000')
            };
            req.cookies[securityCookie] = token;
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
            const nodeCacheGetStub = sinon.stub().returns({roles: ['citizen']});
            const SecurityStub = proxyquire('app/services/Security', {
                'config': {'services': {'idam': {'caching': 'true'}}},
                'node-cache': sinon.stub().callsFake(() => {
                    return {get: nodeCacheGetStub};
                })
            });
            security = new SecurityStub(loginUrl);

            const handleSuccessfulIdamDetailsResponseStub = sinon.stub();
            const _authorizeStub = sinon.stub();
            security.handleSuccessfulIdamDetailsResponse = handleSuccessfulIdamDetailsResponseStub;
            security._authorize = _authorizeStub;

            protect = security.protect(role);
            protect(req, res, next);
            checkAsync(() => {
                expect(handleSuccessfulIdamDetailsResponseStub.calledOnce).to.equal(true);
                expect(_authorizeStub.calledOnce).to.equal(true);
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
            security.handleSuccessfulIdamDetailsResponse = sinon.stub();
            security._authorize = sinon.stub();

            protect = security.protect(role);
            protect(req, res, next);

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
        let protect;
        let callBackEndpoint;
        let req;
        let res;
        let next;
        let revertOauth2Token;
        let revertIdamSession;

        beforeEach(() => {
            revertOauth2Token = Security.__set__('Oauth2Token', class {
                post() {
                    return Promise.resolve({access_token: token});
                }
            });
            revertIdamSession = Security.__set__('IdamSession', class {
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

            protect = security.protect(role);
            callBackEndpoint = security.oAuth2CallbackEndpoint();

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
            revertOauth2Token();
            revertIdamSession();
        });

        it('should redirect to login page when security cookie not defined', () => {
            req.protocol = 'http';
            req.originalUrl = '/';
            req.baseUrl = '/';

            protect(req, res, next);

            sinon.assert.calledOnce(res.redirect);
            expect(res.redirect).to.have.been.calledWith(loginUrlWithContinue);
        });

        it('should redirect to login page when cookies null or undefined', () => {
            req.cookies = null;
            req.protocol = 'http';
            req.originalUrl = '/';
            req.baseUrl = '/';

            protect(req, res, next);

            sinon.assert.calledOnce(res.redirect);
            expect(res.redirect).to.have.been.calledWith(loginUrlWithContinue);
        });

        it('should redirect to login page when IdamSession.get() returns Unauthorized', (done) => {
            const revert = Security.__set__('IdamSession', class {
                get() {
                    return promise;
                }
            });

            req.session = {language: 'cy', expires: expiresTime};
            req.cookies[securityCookie] = token;
            req.protocol = 'http';
            req.baseUrl = '/';
            const promise = when({name: 'Error', message: 'Unauthorized'});

            protect(req, res, next);

            promise
                .then(() => {
                    sinon.assert.calledOnce(res.redirect);
                    expect(res.redirect).to.have.been.calledWith(loginUrlWithContinue);
                    revert();
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });

        it('should invalidate stale auth and redirect to login when session is lost', (done) => {
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

                delete(accessToken) {
                    return deleteStub(accessToken);
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
            req.cookies[securityCookie] = token;
            req.protocol = 'http';
            req.baseUrl = '/';
            req.originalUrl = '/';
            req.authToken = token;
            req.userId = 'immutable-idam-user-id';
            security.sessionConcurrency = {
                canManageSession: sinon.stub().throws(new Error('should not be called'))
            };

            protect(req, res, next);

            checkAsync(() => {
                sinon.assert.notCalled(res.redirect);
                settleDelete({});
            });

            checkAsync(() => {
                sinon.assert.calledOnce(destroyStub);
                sinon.assert.calledOnce(deleteStub);
                sinon.assert.calledWith(deleteStub, token);
                sinon.assert.calledTwice(res.clearCookie);
                sinon.assert.calledWith(res.clearCookie.firstCall, securityCookie);
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
                expect(res.redirect).to.have.been.calledWith(loginUrlWithContinue);
                sinon.assert.notCalled(next);
                sinon.assert.notCalled(security.sessionConcurrency.canManageSession);
                revert();
                done();
            });
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

                delete(accessToken) {
                    return deleteStub(accessToken);
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
            req.cookies[securityCookie] = token;
            req.protocol = 'http';
            req.baseUrl = '/';
            req.originalUrl = '/';
            req.authToken = token;
            req.userId = 'immutable-idam-user-id';
            security.sessionConcurrency = {
                canManageSession: sinon.stub().throws(new Error('should not be called'))
            };

            protect(req, res, next);

            checkAsync(() => {
                sinon.assert.notCalled(res.redirect);
                rejectDelete(new Error('idam failure'));
            });

            checkAsync(() => {
                sinon.assert.calledOnce(destroyStub);
                sinon.assert.calledOnce(deleteStub);
                sinon.assert.calledTwice(res.clearCookie);
                sinon.assert.calledWith(res.clearCookie.firstCall, securityCookie);
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
                expect(res.redirect).to.have.been.calledWith(loginUrlWithContinue);
                sinon.assert.notCalled(next);
                sinon.assert.notCalled(security.sessionConcurrency.canManageSession);
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

                delete(accessToken) {
                    return deleteStub(accessToken);
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
            req.cookies[securityCookie] = token;
            req.protocol = 'http';
            req.baseUrl = '/';
            req.originalUrl = '/';
            req.authToken = token;
            req.userId = 'immutable-idam-user-id';
            security.sessionConcurrency = {
                canManageSession: sinon.stub().throws(new Error('should not be called'))
            };
            security._authorize = sinon.stub().throws(new Error('should not be called'));

            protect(req, res, next);

            checkAsync(() => {
                sinon.assert.notCalled(res.redirect);
                settleDelete(new Error('IDAM 401 empty response'));
            });

            checkAsync(() => {
                sinon.assert.calledOnce(destroyStub);
                sinon.assert.calledOnce(deleteStub);
                sinon.assert.calledTwice(res.clearCookie);
                sinon.assert.calledWith(res.clearCookie.firstCall, securityCookie);
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
                expect(res.redirect).to.have.been.calledWith(loginUrlWithContinue);
                expect(res.redirect.firstCall.args[0]).to.not.equal(timeoutUrl);
                sinon.assert.notCalled(next);
                sinon.assert.notCalled(security.sessionConcurrency.canManageSession);
                sinon.assert.notCalled(security._authorize);
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

                delete(accessToken) {
                    return deleteStub(accessToken);
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
            req.cookies[securityCookie] = token;
            req.protocol = 'http';
            req.baseUrl = '/';
            req.originalUrl = '/';
            req.authToken = token;
            req.userId = 'immutable-idam-user-id';
            security.sessionConcurrency = {
                canManageSession: sinon.stub().throws(new Error('should not be called'))
            };

            protect(req, res, next);

            checkAsync(() => {
                sinon.assert.notCalled(res.redirect);
                settleDelete({});
            });

            checkAsync(() => {
                sinon.assert.calledOnce(destroyStub);
                sinon.assert.calledOnce(deleteStub);
                sinon.assert.calledTwice(res.clearCookie);
                sinon.assert.calledWith(res.clearCookie.firstCall, securityCookie);
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
                expect(res.redirect).to.have.been.calledWith(loginUrlWithContinue);
                sinon.assert.notCalled(next);
                sinon.assert.notCalled(security.sessionConcurrency.canManageSession);
                revert();
                done();
            });
        });

        it('should redirect to time-out page when session has expired', (done) => {
            const revert = Security.__set__('IdamSession', class {
                get() {
                    return promise;
                }
            });

            req.session = {expires: expiresTimeInThePast};
            req.cookies[securityCookie] = token;
            req.protocol = 'http';
            const promise = when({name: 'Success'});

            protect(req, res, next);

            promise
                .then(() => {
                    sinon.assert.calledOnce(res.redirect);
                    expect(res.redirect).to.have.been.calledWith(timeoutUrl);
                    revert();
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });

        it('should invalidate stale auth and redirect to login when the session is superseded by a newer login', (done) => {
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
            req.sessionID = 'stale-session-id';
            const sessionStore = {destroy: sinon.stub()};
            req.sessionStore = sessionStore;
            req.cookies[securityCookie] = token;
            req.protocol = 'http';
            req.baseUrl = '/';
            req.originalUrl = '/';
            req.authToken = token;
            req.userId = 'immutable-idam-user-id';

            const revert = Security.__set__('IdamSession', class {
                get() {
                    return Promise.resolve({
                        email: 'user@example.com',
                        id: 'immutable-idam-user-id',
                        roles: [role, 'citizen']
                    });
                }

                delete(accessToken) {
                    return deleteStub(accessToken);
                }
            });

            security.sessionConcurrency = {
                canManageSession: sinon.stub().returns(true),
                assertAndTouch: sinon.stub().resolves(false),
                activateLatest: sinon.stub().resolves()
            };

            protect(req, res, next);

            checkAsync(() => {
                sinon.assert.calledWith(security.sessionConcurrency.assertAndTouch, sessionStore, 'immutable-idam-user-id', 'stale-session-id');
                sinon.assert.notCalled(security.sessionConcurrency.activateLatest);
                sinon.assert.calledOnce(destroyStub);
                sinon.assert.calledOnce(deleteStub);
                sinon.assert.calledWith(deleteStub, token);
                sinon.assert.calledTwice(res.clearCookie);
                sinon.assert.calledWith(res.clearCookie.firstCall, securityCookie);
                sinon.assert.calledWith(res.clearCookie.secondCall, expressSessionCookie);
                sinon.assert.calledOnce(res.redirect);
                expect(res.clearCookie.firstCall.callId).to.be.lessThan(res.redirect.firstCall.callId);
                expect(res.clearCookie.secondCall.callId).to.be.lessThan(res.redirect.firstCall.callId);
                expect(res.redirect).to.have.been.calledWith(loginUrlWithContinue);
                expect(req.session).to.equal(undefined);
                expect(req.sessionID).to.equal(undefined);
                expect(req.sessionStore).to.equal(undefined);
                expect(req.authToken).to.equal(undefined);
                expect(req.userId).to.equal(undefined);
                sinon.assert.notCalled(next);
                revert();
                done();
            });
        });

        it('stores immutable IDAM ID separately from email registration ID', () => {
            req.session = {};

            security.handleSuccessfulIdamDetailsResponse(req, {
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
            req.cookies[securityCookie] = token;
            req.protocol = 'http';
            security.sessionConcurrency = {
                canManageSession: sinon.stub().returns(true),
                assertAndTouch: sinon.stub().resolves(true),
                activateLatest: sinon.stub().resolves()
            };

            protect(req, res, next);

            checkAsync(() => {
                sinon.assert.calledWith(security.sessionConcurrency.assertAndTouch, req.sessionStore, 'immutable-idam-user-id', 'current-session-id');
                sinon.assert.notCalled(security.sessionConcurrency.activateLatest);
                sinon.assert.calledOnce(next);
                done();
            });
        });

        it('persists cached immutable IDAM ID before ownership validation', (done) => {
            req.session = {expires: expiresTime, language: 'en', regId: 'cached-user@example.com'};
            req.sessionID = 'current-session-id';
            req.sessionStore = {};
            req.cookies[securityCookie] = token;
            req.protocol = 'http';
            security.idamDetailsCache = {
                get: sinon.stub().withArgs('cached-user@example.com').returns({
                    email: 'cached-user@example.com',
                    id: 'cached-immutable-id',
                    roles: [role]
                })
            };
            security.sessionConcurrency = {
                canManageSession: sinon.stub().returns(true),
                assertAndTouch: sinon.stub().callsFake(() => {
                    expect(req.session.idamUserId).to.equal('cached-immutable-id');
                    return Promise.resolve(true);
                }),
                activateLatest: sinon.stub().resolves()
            };

            protect(req, res, next);

            checkAsync(() => {
                sinon.assert.calledWith(security.sessionConcurrency.assertAndTouch, req.sessionStore, 'cached-immutable-id', 'current-session-id');
                expect(req.session.regId).to.equal('cached-user@example.com');
                sinon.assert.calledOnce(next);
                done();
            });
        });

        it('redirects to time-out when ownership validation rejects and cannot fall through to authorisation', (done) => {
            const destroyStub = sinon.stub().callsFake(callback => {
                delete req.session;
                delete req.sessionStore;
                if (callback) {
                    callback();
                }
            });
            req.session = {expires: expiresTime, language: 'cy', destroy: destroyStub};
            req.sessionID = 'current-session-id';
            req.sessionStore = {};
            req.cookies[securityCookie] = token;
            req.protocol = 'http';
            req.baseUrl = '/';
            req.originalUrl = '/';
            security.sessionConcurrency = {
                canManageSession: sinon.stub().returns(true),
                assertAndTouch: sinon.stub().rejects(new Error('redis failed')),
                activateLatest: sinon.stub().resolves()
            };

            protect(req, res, next);

            checkAsync(() => {
                sinon.assert.calledOnce(res.redirect);
                expect(res.redirect).to.have.been.calledWith(timeoutUrl);
                sinon.assert.calledOnce(destroyStub);
                expect(req.session).to.equal(undefined);
                expect(req.sessionID).to.equal(undefined);
                expect(req.sessionStore).to.equal(undefined);
                sinon.assert.notCalled(next);
                done();
            });
        });

        it('passes _authorize errors to next once after ownership validation succeeds', (done) => {
            const authorizeError = new Error('authorize failed');
            req.session = {expires: expiresTime, language: 'en'};
            req.sessionID = 'current-session-id';
            req.sessionStore = {};
            req.cookies[securityCookie] = token;
            req.protocol = 'http';
            security.sessionConcurrency = {
                canManageSession: sinon.stub().returns(true),
                assertAndTouch: sinon.stub().resolves(true),
                activateLatest: sinon.stub().resolves()
            };
            security._authorize = sinon.stub().throws(authorizeError);

            protect(req, res, next);

            checkAsync(() => {
                sinon.assert.calledOnce(next);
                sinon.assert.calledWithExactly(next, authorizeError);
                sinon.assert.notCalled(res.render);
                sinon.assert.notCalled(res.redirect);
                done();
            });
        });

        it('passes IdamSession.get rejections to next once without extra redirects', (done) => {
            const getError = new Error('idam get failed');
            const revert = Security.__set__('IdamSession', class {
                get() {
                    return Promise.reject(getError);
                }
            });

            req.session = {expires: expiresTime, language: 'en'};
            req.sessionID = 'current-session-id';
            req.sessionStore = {};
            req.cookies[securityCookie] = token;
            req.protocol = 'http';

            protect(req, res, next);

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
            req.cookies[securityCookie] = token;
            req.protocol = 'http';

            security._authorize = sinon.stub();
            security._validateActiveSession = sinon.stub().rejects(chainError);

            protect(req, res, next);

            checkAsync(() => {
                sinon.assert.calledOnce(next);
                sinon.assert.calledWithExactly(next, chainError);
                sinon.assert.notCalled(security._authorize);
                sinon.assert.notCalled(res.render);
                sinon.assert.notCalled(res.redirect);
                done();
            });
        });

        it('logs redacted error type when stale-token invalidation fails', (done) => {
            const sentinel = 'https://idam.local/session/token-secret-123';
            const loggerErrorSpy = sinon.spy();
            const revertLogger = Security.__set__('loggerRaw', () => ({error: loggerErrorSpy, debug: sinon.stub()}));
            const revert = Security.__set__('IdamSession', class {
                delete() {
                    const err = new Error(`contains ${sentinel}`);
                    err.name = 'IdamDeleteError';
                    return Promise.reject(err);
                }
            });

            req.session = {
                language: 'cy',
                destroy: callback => callback()
            };
            req.cookies[securityCookie] = token;
            req.log = {error: loggerErrorSpy, debug: sinon.stub()};
            req.baseUrl = '/';
            req.originalUrl = '/';
            req.protocol = 'http';

            security._reauthenticateUser(req, res).then(() => {
                const messages = loggerErrorSpy.getCalls().map(call => call.args.join(' ')).join('\n');
                expect(messages).to.contain('Unable to invalidate stale IDAM session token (IdamDeleteError).');
                expect(messages).to.not.contain(sentinel);
                revert();
                revertLogger();
                done();
            }).catch(done);
        });

        it('logs redacted error type when ownership validation fails', (done) => {
            const sentinel = 'redis://user:token@localhost:6379/0';
            const validationError = new Error(`boom ${sentinel}`);
            validationError.name = 'RedisConnectionError';
            const loggerErrorSpy = sinon.spy();
            const revertLogger = Security.__set__('loggerRaw', () => ({error: loggerErrorSpy, debug: sinon.stub()}));

            req.session = {
                expires: expiresTime,
                idamUserId: 'immutable-idam-user-id',
                language: 'cy',
                destroy: callback => callback()
            };
            req.sessionID = 'current-session-id';
            req.sessionStore = {};
            req.cookies[securityCookie] = token;
            req.protocol = 'http';
            req.baseUrl = '/';
            req.originalUrl = '/';
            security.sessionConcurrency = {
                canManageSession: sinon.stub().returns(true),
                assertAndTouch: sinon.stub().rejects(validationError),
                activateLatest: sinon.stub().resolves()
            };

            protect(req, res, next);

            checkAsync(() => {
                const messages = loggerErrorSpy.getCalls().map(call => call.args.join(' ')).join('\n');
                expect(messages).to.contain('Unable to validate active session mapping (RedisConnectionError).');
                expect(messages).to.not.contain(sentinel);
                revertLogger();
                done();
            });
        });

        it('logs redacted error type when superseded-session destruction fails', (done) => {
            const sentinel = 'token-secret-redirect-url';
            const loggerErrorSpy = sinon.spy();
            const revertLogger = Security.__set__('loggerRaw', () => ({error: loggerErrorSpy, debug: sinon.stub()}));
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
            req.cookies[securityCookie] = token;
            req.log = {error: loggerErrorSpy, debug: sinon.stub()};
            req.baseUrl = '/';
            req.originalUrl = '/';
            req.protocol = 'http';

            security._reauthenticateUser(req, res).then(() => {
                const messages = loggerErrorSpy.getCalls().map(call => call.args.join(' ')).join('\n');
                expect(messages).to.contain('Unable to destroy superseded local session (SessionStoreError).');
                expect(messages).to.not.contain(sentinel);
                revert();
                revertLogger();
                done();
            }).catch(done);
        });

        it('logs redacted error type when previous session destruction fails during activation', (done) => {
            const sentinel = 'https://idam.local?token=sensitive';
            const loggerErrorSpy = sinon.spy();
            const revertLogger = Security.__set__('loggerRaw', () => ({error: loggerErrorSpy, debug: sinon.stub()}));
            req.log = {error: loggerErrorSpy, debug: sinon.stub()};
            security.sessionConcurrency = {
                activateLatest: sinon.stub().resolves({destroyError: new Error(`oops ${sentinel}`)})
            };
            req.session = {idamUserId: 'immutable-idam-user-id'};
            req.sessionID = 'session-id';
            req.sessionStore = {};

            security._activateLatestSession(req).then(() => {
                const messages = loggerErrorSpy.getCalls().map(call => call.args.join(' ')).join('\n');
                expect(messages).to.contain('Unable to destroy previous active session (Error).');
                expect(messages).to.not.contain(sentinel);
                revertLogger();
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

            req.cookies[securityCookie] = token;

            protect(req, res, next);
            revert();
        });

        it('should deny access when user roles do not match resource role', (done) => {
            const revert = Security.__set__('IdamSession', class {
                get() {
                    return promise;
                }
            });

            req.session = {expires: expiresTime, language: 'en'};
            req.cookies[securityCookie] = token;

            const promise = when({
                roles: ['CITIZEN', 'ROOT']
            });

            protect(req, res, next);

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
            req.cookies[securityCookie] = token;

            const promise = when({
                roles: [role, 'ROOT']
            });

            protect(req, res, next);

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

        it('should make the auth cookie secure if the protocol is http', (done) => {
            req.protocol = 'http';
            req.cookies.__redirect = JSON.stringify({state: 'testState', continue_url: '/continue'});
            callBackEndpoint(req, res, next);

            checkAsync(() => {
                expect(res.cookie).to.have.been.calledWith(securityCookie, token, {secure: true, httpOnly: true});
                expect(res.redirect).to.have.been.calledWith('/continue');
                done();
            });
        });

        it('should make the auth cookie secure if the protocol is https', () => {
            req.protocol = 'https';
            req.cookies.__redirect = JSON.stringify({state: 'testState', continue_url: '/continue'});

            callBackEndpoint(req, res, next);

            checkAsync(() => {
                expect(res.cookie).to.have.been.calledWith(securityCookie, token, {secure: true, httpOnly: true});
            });
        });

        it('activates latest callback session before setting the authenticated cookie and redirecting', (done) => {
            const callOrder = [];
            req.protocol = 'http';
            req.sessionID = 'new-session-id';
            req.sessionStore = {};
            req.cookies.__redirect = JSON.stringify({state: 'testState', continue_url: '/continue'});
            security.sessionConcurrency = {
                activateLatest: sinon.stub().callsFake((sessionStore, userId, sessionId) => {
                    callOrder.push('activate');
                    expect(userId).to.equal('immutable-idam-user-id');
                    expect(sessionId).to.equal('new-session-id');
                    return Promise.resolve({previousSessionId: 'old-session-id'});
                })
            };
            res.cookie = sinon.stub().callsFake(() => callOrder.push('cookie'));
            res.redirect = sinon.stub().callsFake(() => callOrder.push('redirect'));

            callBackEndpoint(req, res, next);

            checkAsync(() => {
                expect(callOrder).to.deep.equal(['activate', 'cookie', 'redirect']);
                sinon.assert.notCalled(next);
                done();
            });
        });

        it('passes callback mapping failures to error middleware without setting cookie or redirecting', (done) => {
            const redisError = new Error('mapping write failed');
            req.protocol = 'http';
            req.sessionID = 'new-session-id';
            req.sessionStore = {};
            req.cookies.__redirect = JSON.stringify({state: 'testState', continue_url: '/continue'});
            security.sessionConcurrency = {
                activateLatest: sinon.stub().rejects(redisError)
            };

            callBackEndpoint(req, res, next);

            checkAsync(() => {
                sinon.assert.calledWith(next, redisError);
                sinon.assert.notCalled(res.cookie);
                sinon.assert.notCalled(res.redirect);
                done();
            });
        });
    });

    const checkAsync = (callback) => {
        setTimeout(() => {
            callback();
        }, 50);
    };
});
