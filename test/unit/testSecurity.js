'use strict';
const proxyquire = require('proxyquire'),
    chai = require('chai'),
    sinon = require('sinon'),
    when = require('when'),
    expect = chai.expect,
    sinonChai = require('sinon-chai');

const services = require('app/components/services');

chai.use(sinonChai);

describe('Security middleware', function () {
    const ROLE = 'probate-private-beta';

    const LOGIN_URL = 'http://localhost:8000/login';
    const LOGIN_URL_WITH_CONTINUE = LOGIN_URL + '?response_type=code&state=57473&client_id=probate&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth2%2Fcallback';
    const TOKEN = 'dummyToken';
    const API_URL = 'http://localhost:7000/';
    const appConfig = require('../../app/config');
    const SECURITY_COOKIE = '__auth-token-' + appConfig.payloadVersion;

    describe('protect', function () {

        let security, protect, config, getUserDetailsStub, callBackEndpoint, getOauth2TokenStub;

        let req, res, next;

        beforeEach(function () {
            config = {
                idam: {
                    apiUrl: API_URL
                }
            };

            const Security = proxyquire('app/components/security', {
                '../config': config,
            });

            getUserDetailsStub = sinon.stub(services, 'getUserDetails');
            getOauth2TokenStub = sinon.stub(services, 'getOauth2Token', () => {
                return Promise.resolve({access_token: TOKEN});
            });

            security = new Security(LOGIN_URL);
            security._generateState = function () {
                return '57473';
            };

            protect = security.protect(ROLE);
            callBackEndpoint = security.oAuth2CallbackEndpoint();

            req = {cookies: [], query: {state: 'testState', code: '123'}};
            req.get = sinon.stub().returns('localhost:3000');
            res = {};
            res.render = sinon.spy();
            res.redirect = sinon.spy();
            res.status = sinon.spy();
            res.cookie = sinon.spy();
            res.clearCookie = sinon.spy();
            next = sinon.spy();
        });

        afterEach(function () {
            getUserDetailsStub.restore();
            getOauth2TokenStub.restore();
        });

        it('should redirect to login page when security cookie not defined', function () {
            req.protocol = 'http';
            req.originalUrl = '/';

            protect(req, res, next);

            sinon.assert.calledOnce(res.redirect);
            expect(res.redirect).to.have.been.calledWith(LOGIN_URL_WITH_CONTINUE);
        });

        it('should redirect to login page when cookies null or undefined', function () {
            req.cookies = null;

            req.protocol = 'http';
            req.originalUrl = '/';

            protect(req, res, next);

            sinon.assert.calledOnce(res.redirect);
            expect(res.redirect).to.have.been.calledWith(LOGIN_URL_WITH_CONTINUE);
        });

        it('should redirect to login page when getUserDetails returns Unauthorized', function (done) {
            req.cookies[SECURITY_COOKIE] = TOKEN;
            req.session = {};
            req.protocol = 'http';
            const promise = when({name: 'Error', message: 'Unauthorized'});

            getUserDetailsStub.returns(promise);

            protect(req, res, next);

            promise
                .then(() => {
                    sinon.assert.calledOnce(res.redirect);
                    expect(res.redirect).to.have.been.calledWith(LOGIN_URL_WITH_CONTINUE);
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });

        it('should retrieve user details when auth token provided', function () {
            req.cookies[SECURITY_COOKIE] = TOKEN;
            getUserDetailsStub.returns(when({name: 'Error'}));

            protect(req, res, next);

            sinon.assert.calledOnce(getUserDetailsStub);
            sinon.assert.calledWith(getUserDetailsStub, TOKEN);
        });

        it('should deny access when user roles do not match resource role', function (done) {
            req.cookies[SECURITY_COOKIE] = TOKEN;
            req.session = {};

            const promise = when({
                roles: ['CITIZEN', 'ROOT']
            });

            getUserDetailsStub.returns(promise);

            protect(req, res, next);

            promise
                .then(() => {
                    expect(res.status).to.have.been.calledWith(403);
                    expect(res.render).to.have.been.calledWith('errors/403');
                    done();
                })
                .catch((err) => {
                    done(err);
                });

        });

        it('should grant access when user roles do match resource role - pa', function (done) {
            req.cookies[SECURITY_COOKIE] = TOKEN;
            req.session = {};

            const promise = when({
                roles: [ROLE, 'ROOT']
            });
            getUserDetailsStub.returns(promise);

            protect(req, res, next);

            promise
                .then(() => {
                    expect(next).to.have.been.calledWithExactly();
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });

        it('should add the auth cookie to the response', function (done) {
            req.protocol = 'http';
            req.cookies.__redirect = JSON.stringify({state: 'testState'});
            callBackEndpoint(req, res, next);

            checkAsync(() => {
                expect(res.cookie).to.have.been.calledWith(SECURITY_COOKIE, TOKEN, {httpOnly: true});
                done();
            });
        });

        it('should make the auth cookie secure if the protocol is https', function () {
            req.protocol = 'https';
            req.cookies.__redirect = JSON.stringify({state: 'testState'});

            callBackEndpoint(req, res, next);

            checkAsync(() => {
                expect(res.cookie).to.have.been.calledWith(SECURITY_COOKIE, TOKEN, {secure: true, httpOnly: true});
            });
        });
    });

    function checkAsync(callback) {
        setTimeout(function() {
          callback();
        }, 50);
      }
});
