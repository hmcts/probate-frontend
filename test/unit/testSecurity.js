'use strict';

const chai = require('chai');
const sinon = require('sinon');
const when = require('when');
const sinonChai = require('sinon-chai');
const rewire = require('rewire');
const Security = rewire('app/components/security');
const expect = chai.expect;

chai.use(sinonChai);

describe('Security middleware', () => {
    const role = 'probate-private-beta';
    const loginUrl = 'http://localhost:8000/login';
    const loginUrlWithContinue = `${loginUrl}?response_type=code&state=57473&client_id=probate&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth2%2Fcallback`;
    const token = 'dummyToken';
    const appConfig = require('../../app/config');
    const securityCookie = `__auth-token-${appConfig.payloadVersion}`;

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
                    form: {
                        journeyType: 'probate'
                    }
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

        it('should retrieve user details when auth token provided', () => {
            const revert = Security.__set__('IdamSession', class {
                get() {
                    return Promise.resolve({name: 'Error'});
                }
            });

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

            req.cookies[securityCookie] = token;

            const promise = when({
                roles: ['CITIZEN', 'ROOT']
            });

            protect(req, res, next);

            promise
                .then(() => {
                    expect(res.status).to.have.been.calledWith(403);
                    expect(res.render).to.have.been.calledWith('errors/403');
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

        it('should add the auth cookie to the response', (done) => {
            req.protocol = 'http';
            req.cookies.__redirect = JSON.stringify({state: 'testState'});
            callBackEndpoint(req, res, next);

            checkAsync(() => {
                expect(res.cookie).to.have.been.calledWith(securityCookie, token, {httpOnly: true});
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
