'use strict';

const routes = require('app/routes');
const expect = require('chai').expect;

describe('routes', () => {
    it('should contain /inviteIdList', () => {
        expect(routes.stack.some(s => s.route && s.route.path && s.route.path === '/inviteIdList')).to.equal(true);
    });
});
