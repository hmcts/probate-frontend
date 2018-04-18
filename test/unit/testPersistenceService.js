/*global describe, it, before, beforeEach, after, afterEach */
'use strict';
const assert = require('chai').assert;
const sinon = require('sinon');
const when = require('when');
const utils = require('../../app/components/api-utils');
const services = require('../../app/components/services');

describe('persistence service tests', function () {
    let fetchJsonStub, loadFormDataSpy, saveFormDataSpy;

    beforeEach(function () {
        fetchJsonStub = sinon.stub(utils, 'fetchJson');
        loadFormDataSpy = sinon.spy(services, 'loadFormData');
        saveFormDataSpy = sinon.spy(services, 'saveFormData');
    });

    afterEach(function () {
        fetchJsonStub.restore();
        loadFormDataSpy.restore();
        saveFormDataSpy.restore();
    });

    it('Should successfully retrieve user data with id 1234', function (done) {
        const expectedResponse = {'formdata': {'firstname': 'tester', 'lastname': 'tester'}};
        fetchJsonStub.returns(when(expectedResponse));

        services.loadFormData('1234')
            .then(function(actualResponse) {
                sinon.assert.alwaysCalledWith(loadFormDataSpy, '1234');
                assert.strictEqual(expectedResponse, actualResponse);
                done();
            })
            .catch(done);
    });

    it('Should successfully persist user data with id 1234', function (done) {
        const data = {'formdata': {'firstname': 'tester', 'lastname': 'tester'}};
        fetchJsonStub.returns(when(data));

        services.saveFormData('1234', data)
            .then(function(actualResponse) {
                sinon.assert.alwaysCalledWith(saveFormDataSpy, '1234', data);
                assert.strictEqual(data, actualResponse);
                done();
            })
            .catch(done);
    });

    it('Should fail to retrieve user data with id 1234', function (done) {
        const expectedError = new Error('Failed to retrieve user data');
        fetchJsonStub.returns(when(expectedError));

        services.loadFormData('1234')
            .then(function(actualError) {
                sinon.assert.alwaysCalledWith(loadFormDataSpy, '1234');
                assert.strictEqual(expectedError, actualError);
                done();
            })
            .catch(done);
    });

    it('Should fail to persist user data with id 1234', function (done) {
        const data = {'formdata': {'firstname': 'tester', 'lastname': 'tester'}};
        const expectedError = new Error('Failed to retrieve user data');
        fetchJsonStub.returns(when(expectedError));

        services.saveFormData('1234', data)
            .then(function(actualError) {
                sinon.assert.alwaysCalledWith(saveFormDataSpy, '1234', data);
                assert.strictEqual(expectedError, actualError);
                done();
            })
            .catch(done);
    });

    it('Should successfully verify link', function (done) {
        const expectedResponse = {'valid': true};
        const findInviteLinkUrl = 'http://localhost:8282/invitedata/true';
        fetchJsonStub.returns(when(expectedResponse));

        services.findInviteLink('true')
            .then(function(actualResponse) {
                sinon.assert.alwaysCalledWith(fetchJsonStub, findInviteLinkUrl, sinon.match.any);
                assert.strictEqual(expectedResponse, actualResponse);
                done();
            })
        .catch(done);
    });
});
