const {authenticateUsernameAndPassword, getStore, forceHttps} = require('../../../app/components/utils');
const {commonNext, commonReq, commonRes} = require('../../util/commonConsts');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const session = require('express-session');
const expect = require('chai').expect;

describe('utils', () => {
    let req;
    let res;
    let next;
    let authStub;

    beforeEach(() => {
        req = commonReq;
        res = commonRes;
        next = commonNext;
    });

    afterEach(() => {
        res.send.reset();
        res.set.reset();
        res.sendStatus.reset();
        res.redirect.reset();
        next.reset();
    });

    describe('authenticateUsernameAndPassword', () => {
        const TEST_NO_USERNAME_OR_PASSWORD_ERR_MESSAGE = '<h1>Error:</h1><p>Username or password not set.';

        it('no username sends error', () => {
            const username = '';
            const password = 'passw0rD123';
            const authenticateUsernameAndPasswordMethod = authenticateUsernameAndPassword(username, password);
            authenticateUsernameAndPasswordMethod(req, res, next);

            sinon.assert.calledOnce(res.send);
            sinon.assert.calledWith(res.send, TEST_NO_USERNAME_OR_PASSWORD_ERR_MESSAGE);
        });

        it('no password sends error', () => {
            const username = 'testUsername';
            const password = '';
            const authenticateUsernameAndPasswordMethod = authenticateUsernameAndPassword(username, password);
            authenticateUsernameAndPasswordMethod(req, res, next);

            sinon.assert.calledOnce(res.send);
            sinon.assert.calledWith(res.send, TEST_NO_USERNAME_OR_PASSWORD_ERR_MESSAGE);
        });

        it('no user returned by basicAuth', () => {
            const username = 'testUsername';
            const password = 'password';
            authStub = sinon.stub().returns({});
            const stubbedUtil = proxyquire('../../../app/components/utils', {'basic-auth': {auth: authStub}});
            const authenticateUsernameAndPasswordMethod = stubbedUtil.authenticateUsernameAndPassword(username, password);
            authenticateUsernameAndPasswordMethod(req, res, next);

            sinon.assert.calledOnce(res.set);
            sinon.assert.calledWith(res.set, 'WWW-Authenticate', 'Basic realm=Authorization Required');
            sinon.assert.calledOnce(res.sendStatus);
            sinon.assert.calledWith(res.sendStatus, 401);

            authStub.reset();
        });

        it('user with different password', () => {
            const username = 'testUsername';
            const password = 'password';
            authStub = sinon.stub().returns({name: 'testUsername', pass: 'differentPassword'});
            const stubbedUtil = proxyquire('../../../app/components/utils', {'basic-auth': {auth: authStub}});
            const authenticateUsernameAndPasswordMethod = stubbedUtil.authenticateUsernameAndPassword(username, password);
            authenticateUsernameAndPasswordMethod(req, res, next);

            sinon.assert.calledOnce(res.set);
            sinon.assert.calledWith(res.set, 'WWW-Authenticate', 'Basic realm=Authorization Required');
            sinon.assert.calledOnce(res.sendStatus);
            sinon.assert.calledWith(res.sendStatus, 401);

            authStub.reset();
        });

        it('user with different username', () => {
            const username = 'testUsername';
            const password = 'password';
            authStub = sinon.stub().returns({name: 'differentTestUsername', pass: 'password'});
            const stubbedUtil = proxyquire('../../../app/components/utils', {'basic-auth': {auth: authStub}});
            const authenticateUsernameAndPasswordMethod = stubbedUtil.authenticateUsernameAndPassword(username, password);
            authenticateUsernameAndPasswordMethod(req, res, next);

            sinon.assert.calledOnce(res.set);
            sinon.assert.calledWith(res.set, 'WWW-Authenticate', 'Basic realm=Authorization Required');
            sinon.assert.calledOnce(res.sendStatus);
            sinon.assert.calledWith(res.sendStatus, 401);

            authStub.reset();
        });

        it('user with matching user details', () => {
            const username = 'testUsername';
            const password = 'password';
            authStub = sinon.stub().returns({name: 'testUsername', pass: 'password'});
            const stubbedUtil = proxyquire('../../../app/components/utils', {'basic-auth': {auth: authStub}});
            const authenticateUsernameAndPasswordMethod = stubbedUtil.authenticateUsernameAndPassword(username, password);
            authenticateUsernameAndPasswordMethod(req, res, next);

            sinon.assert.notCalled(res.set);
            sinon.assert.notCalled(res.sendStatus);
            sinon.assert.calledOnce(next);

            authStub.reset();
        });
    });

    describe('forceHttps', () => {
        it('x-forwarded-proto is not https', () => {
            req.get = sinon.stub().returns('host.');
            req.url = 'testUrl.com';
            req.headers['x-forwarded-proto'] = 'http';
            forceHttps(req, res, next);
            sinon.assert.calledOnce(res.redirect);
            sinon.assert.calledWith(res.redirect, 302, 'https://host.testUrl.com');
        });

        it('x-forwarded-proto is https', () => {
            req.headers['x-forwarded-proto'] = 'https';
            forceHttps(req, res, next);
            sinon.assert.notCalled(res.redirect);
            sinon.assert.calledOnce(next);
        });
    });

    describe('getStore', () => {
        it('redis disabled', () => {
            const result = getStore({enabled: 'false'}, session, 100000);
            expect(result.constructor.name).to.equal('MemoryStore');
        });
    });
});
