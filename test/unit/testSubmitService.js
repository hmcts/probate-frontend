/*global describe, it, before, beforeEach, after, afterEach */
'use strict';
const assert = require('chai').assert;
const sinon = require('sinon');
const when = require('when');
const utils = require('app/components/api-utils');
const services = require('app/components/services');

describe('submit service tests', function () {
    let fetchJsonStub, submitApplicationSpy;
    const formdata = {
        'applicant': {
            firstname: 'bob',
            lastname: 'smith'
        },
        'assets': {}
    };

    const ctx = {
        sessionID: '1234567890',
        applicantEmail: 'wibble@wobble.com'
    };

    beforeEach(function () {
        fetchJsonStub = sinon.stub(utils, 'fetchJson');
        submitApplicationSpy = sinon.spy(services, 'submitApplication');
    });

    afterEach(function () {
        fetchJsonStub.restore();
        submitApplicationSpy.restore();
    });


    it('Should successfully submit probate application', function (done) {

        fetchJsonStub.returns(when('1488295566956'));

        services.submitApplication(formdata, ctx)
            .then(function(actualResponse) {
                sinon.assert.alwaysCalledWith(submitApplicationSpy, formdata);
                assert.strictEqual('1488295566956', actualResponse);
                done();
            })
            .catch(done);
    });

    it('Should fail to submit probate application', function (done) {

        const expectedError = new Error('Failed to submit probate application');
        fetchJsonStub.returns(when(expectedError));

        services.submitApplication(formdata, ctx)
            .then(function(actualError) {
                sinon.assert.alwaysCalledWith(submitApplicationSpy, formdata);
                assert.strictEqual(expectedError, actualError);
                done();
            })
            .catch(done);
    });
});