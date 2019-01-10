'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const FormData = require('app/services/FormData');

describe('FormDataService', () => {
    describe('get()', () => {
        it('should call log() and fetchJson()', (done) => {
            const endpoint = 'http://localhost';
            const logMessage = 'Get form data';
            const fetchOptions = {method: 'GET'};
            const formData = new FormData(endpoint, 'abc123');
            const logSpy = sinon.spy(formData, 'log');
            const fetchJsonSpy = sinon.spy(formData, 'fetchJson');
            const fetchOptionsStub = sinon.stub(formData, 'fetchOptions').returns(fetchOptions);

            formData.get(logMessage, endpoint);

            expect(formData.log.calledOnce).to.equal(true);
            expect(formData.log.calledWith(logMessage)).to.equal(true);
            expect(formData.fetchJson.calledOnce).to.equal(true);
            expect(formData.fetchJson.calledWith(endpoint, fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchJsonSpy.restore();
            fetchOptionsStub.restore();
            done();
        });
    });
});
