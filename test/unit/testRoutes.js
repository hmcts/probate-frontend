'use strict';
const proxyquire = require('proxyquire');
const expect = require('chai').expect;
const rewire = require('rewire');
const Security = rewire('app/services/Security');
const configStub = { };
const expiresTime = new Date() + 999999;
const expiresTimeInThePast = Date.now() - 1;
const router = require('express').Router();

describe('routes', () => {
    const req = {session: {}};
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

    it('should extend session if active', () => {
        const sessionStatusSecurity = new Security();
        req.session.expires = expiresTime;
        router.get('/start-apply');
        expect(sessionStatusSecurity.getSessionStatus(req)).to.equal('active');
    });

    it('should not extend session if expired', () => {
        const sessionStatusSecurity = new Security();
        req.session.expires = expiresTimeInThePast;
        router.get('/start-apply');
        expect(sessionStatusSecurity.getSessionStatus(req)).to.equal('expired');
    });

    it('should not extend session if lost', () => {
        const sessionStatusSecurity = new Security();
        req.session = {};
        router.get('/start-apply');
        expect(sessionStatusSecurity.getSessionStatus(req)).to.equal('lost');
    });

});
