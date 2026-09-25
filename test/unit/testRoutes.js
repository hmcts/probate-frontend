'use strict';
const proxyquire = require('proxyquire');
const expect = require('chai').expect;
const configStub = { };

describe('routes', () => {

    it('should contain /inviteIdList', () => {
        configStub.environment = 'local';
        const routes = proxyquire('app/routes', {'config': configStub});
        expect(routes.stack.some(s => s.route && s.route.path && s.route.path === '/inviteIdList')).to.equal(true);
    });

    it('should not contain /inviteIdList', () => {
        configStub.environment = 'prod';
        const routes = proxyquire('app/routes', {'config': configStub});
        expect(routes.stack.some(s => s.route && s.route.path && s.route.path === '/inviteIdList')).to.equal(false);
    });

    describe('/sign-out-idam', () => {
        it('should call logoutIdam with sign out url when user is logged in', async () => {
            configStub.environment = 'prod';
            configStub.services = {idam: {apiUrl: 'https://idam.api'}};
            const logoutResult = {ok: true};
            const logoutIdam = () => logoutResult;
            function IdamSessionStub() {
                this.logoutIdam = logoutIdam;
            }

            const routes = proxyquire('app/routes', {
                'config': configStub,
                'app/services/IdamSession': IdamSessionStub
            });

            const signOutRouteLayer = routes.stack.find(s => s.route && s.route.path === '/sign-out-idam');
            const handler = signOutRouteLayer.route.stack[0].handle;
            const req = {
                sessionID: 'session-id',
                userLoggedIn: true,
                protocol: 'https',
                get: (header) => header === 'host' ? 'probate.service.justice.gov.uk' : ''
            };
            const res = {};
            const next = () => {};

            const result = await handler(req, res, next);

            expect(result).to.equal(logoutResult);
        });

        it('should call next when user is not logged in', async () => {
            configStub.environment = 'prod';
            configStub.services = {idam: {apiUrl: 'https://idam.api'}};
            let logoutCalled = false;
            function IdamSessionStub() {
                this.logoutIdam = () => {
                    logoutCalled = true;
                };
            }

            const routes = proxyquire('app/routes', {
                'config': configStub,
                'app/services/IdamSession': IdamSessionStub
            });

            const signOutRouteLayer = routes.stack.find(s => s.route && s.route.path === '/sign-out-idam');
            const handler = signOutRouteLayer.route.stack[0].handle;
            let nextCalled = false;
            const req = {userLoggedIn: false, sessionID: 'session-id'};
            const res = {};
            const next = () => {
                nextCalled = true;
            };

            await handler(req, res, next);

            expect(nextCalled).to.equal(true);
            expect(logoutCalled).to.equal(false);
        });

        it('should pass synchronous logout errors to next', async () => {
            configStub.environment = 'prod';
            configStub.services = {idam: {apiUrl: 'https://idam.api'}};
            const error = new Error('logout failed');
            function IdamSessionStub() {
                this.logoutIdam = () => {
                    throw error;
                };
            }

            const routes = proxyquire('app/routes', {
                'config': configStub,
                'app/services/IdamSession': IdamSessionStub
            });

            const signOutRouteLayer = routes.stack.find(s => s.route && s.route.path === '/sign-out-idam');
            const handler = signOutRouteLayer.route.stack[0].handle;
            let receivedError;
            const req = {
                sessionID: 'session-id',
                userLoggedIn: true,
                protocol: 'http',
                get: () => 'localhost:3000'
            };
            const res = {};
            const next = (err) => {
                receivedError = err;
            };

            await handler(req, res, next);

            expect(receivedError).to.equal(error);
        });
    });

});
