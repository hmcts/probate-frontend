'use strict';

const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;
const rewire = require('rewire');
const SignOut = rewire('app/steps/ui/signout');
const sinon = require('sinon');

describe('Sign-Out', () => {
    it('test correct url is returned from getUrl function', () => {
        assert.equal(SignOut.getUrl(), '/sign-out');
    });
});
