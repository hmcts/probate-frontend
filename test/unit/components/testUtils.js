const {basicAuthUtil} = require('../../../app/components/utils');
const {commonNext, commonReq, commonRes} = require('../../util/commonConsts');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

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
    });

    describe('basicAuthUtil', () => {
        const TEST_NO_USERNAME_OR_PASSWORD_ERR_MESSAGE = '<h1>Error:</h1><p>Username or password not set.';

        it('no username sends error', (done) => {
            const username = '';
            const password = 'passw0rD123';
            const basicAuthUtilMethod = basicAuthUtil(username, password);
            basicAuthUtilMethod(req, res, next);

            sinon.assert.calledOnce(res.send);
            sinon.assert.calledWith(res.send, TEST_NO_USERNAME_OR_PASSWORD_ERR_MESSAGE);
            done();
        });

        it('no password sends error', (done) => {
            const username = 'testUsername';
            const password = '';
            const basicAuthUtilMethod = basicAuthUtil(username, password);
            basicAuthUtilMethod(req, res, next);

            sinon.assert.calledOnce(res.send);
            sinon.assert.calledWith(res.send, TEST_NO_USERNAME_OR_PASSWORD_ERR_MESSAGE);
            done();
        });

        it('no user returned by basicAuth', (done) => {
            const username = 'testUsername';
            const password = 'password';
            authStub = sinon.stub().returns({});
            const stubbedUtil = proxyquire('../../../app/components/utils', {'basic-auth': {auth: authStub}});
            const basicAuthUtilMethod = stubbedUtil.basicAuthUtil(username, password);
            basicAuthUtilMethod(req, res, next);

            sinon.assert.calledOnce(res.set);
            sinon.assert.calledWith(res.set, 'WWW-Authenticate', 'Basic realm=Authorization Required');
            sinon.assert.calledOnce(res.sendStatus);
            sinon.assert.calledWith(res.sendStatus, 401);

            authStub.reset();
            done();
        });

        it('user with different password', (done) => {
            const username = 'testUsername';
            const password = 'password';
            authStub = sinon.stub().returns({name: 'testUsername', pass: 'differentPassword'});
            const stubbedUtil = proxyquire('../../../app/components/utils', {'basic-auth': {auth: authStub}});
            const basicAuthUtilMethod = stubbedUtil.basicAuthUtil(username, password);
            basicAuthUtilMethod(req, res, next);

            sinon.assert.calledOnce(res.set);
            sinon.assert.calledWith(res.set, 'WWW-Authenticate', 'Basic realm=Authorization Required');
            sinon.assert.calledOnce(res.sendStatus);
            sinon.assert.calledWith(res.sendStatus, 401);

            authStub.reset();
            done();
        });

        it('user with different username', (done) => {
            const username = 'testUsername';
            const password = 'password';
            authStub = sinon.stub().returns({name: 'differentTestUsername', pass: 'password'});
            const stubbedUtil = proxyquire('../../../app/components/utils', {'basic-auth': {auth: authStub}});
            const basicAuthUtilMethod = stubbedUtil.basicAuthUtil(username, password);
            basicAuthUtilMethod(req, res, next);

            sinon.assert.calledOnce(res.set);
            sinon.assert.calledWith(res.set, 'WWW-Authenticate', 'Basic realm=Authorization Required');
            sinon.assert.calledOnce(res.sendStatus);
            sinon.assert.calledWith(res.sendStatus, 401);

            authStub.reset();
            done();
        });

        it('user with matching user details', (done) => {
            const username = 'testUsername';
            const password = 'password';
            authStub = sinon.stub().returns({name: 'testUsername', pass: 'password'});
            const stubbedUtil = proxyquire('../../../app/components/utils', {'basic-auth': {auth: authStub}});
            const basicAuthUtilMethod = stubbedUtil.basicAuthUtil(username, password);
            basicAuthUtilMethod(req, res, next);

            sinon.assert.notCalled(res.set);
            sinon.assert.notCalled(res.sendStatus);
            sinon.assert.calledOnce(next);

            authStub.reset();
            done();
        });
    });
});
