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

});
