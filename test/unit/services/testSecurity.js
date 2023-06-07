// eslint-disable-line max-lines
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

        it('should handle successful IDAM response when cached', () => {
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
            expect(handleSuccessfulIdamDetailsResponseStub.calledOnce).to.equal(true);
            expect(_authorizeStub.calledOnce).to.equal(true);
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

        beforeEach(() => {
            revertOauth2Token = Security.__set__('Oauth2Token', class {
                post() {
                    return Promise.resolve({access_token: token});
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
        });

        it('should redirect to login page when security cookie not defined', () => {
            req.protocol = 'http';
            req.originalUrl = '/';

            protect(req, res, next);

            sinon.assert.calledOnce(res.redirect);
            expect(res.redirect).to.have.been.calledWith(loginUrlWithContinue);
        });

        it('should redirect to login page when cookies null or undefined', () => {
            req.cookies = null;
            req.protocol = 'http';
            req.originalUrl = '/';

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

        it('should redirect to time-out page when session is lost', (done) => {
            const revert = Security.__set__('IdamSession', class {
                get() {
                    return promise;
                }
            });

            req.session = {};
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
                    expect(res.status).to.have.been.calledWith(403);
                    expect(res.render).to.have.been.calledWith('errors/error');
                    revert();
                    done();
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
                    expect(next).to.have.been.calledWithExactly();
                    revert();
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });

        it('should make the auth cookie secure if the protocol is http', (done) => {
            req.protocol = 'http';
            req.cookies.__redirect = JSON.stringify({state: 'testState'});
            callBackEndpoint(req, res, next);

            checkAsync(() => {
                expect(res.cookie).to.have.been.calledWith(securityCookie, token, {secure: true, httpOnly: true});
                done();
            });
        });

        it('should make the auth cookie secure if the protocol is https', () => {
            req.protocol = 'https';
            req.cookies.__redirect = JSON.stringify({state: 'testState'});

            callBackEndpoint(req, res, next);

            checkAsync(() => {
                expect(res.cookie).to.have.been.calledWith(securityCookie, token, {secure: true, httpOnly: true});
            });
        });
    });

    const checkAsync = (callback) => {
        setTimeout(() => {
            callback();
        }, 50);
    };
});
