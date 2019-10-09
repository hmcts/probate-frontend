'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const ValidateData = require('app/services/ValidateData');
const caseTypes = require('app/utils/CaseTypes');

describe('ValidateData', () => {
    describe('put()', () => {
        it('should call log() and fetchJson()', (done) => {
            const endpoint = 'http://localhost';
            const url = 'http://localhost/forms/1234567890123456/validations?probateType=PA';
            const fetchOptions = {method: 'PUT'};
            const data = {ccdCase: {id: 1234567890123456}};
            const validateData = new ValidateData(endpoint, 'abc123');

            const logSpy = sinon.spy(validateData, 'log');
            const fetchJsonSpy = sinon.spy(validateData, 'fetchJson');
            const fetchOptionsStub = sinon.stub(validateData, 'fetchOptions').returns(fetchOptions);

            validateData.put(data, 'auth', 'ses123', caseTypes.GOP);

            expect(validateData.log.calledOnce).to.equal(true);
            expect(validateData.log.calledWith('Post validate data')).to.equal(true);
            expect(validateData.fetchJson.calledOnce).to.equal(true);
            expect(validateData.fetchJson.calledWith(url, fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchJsonSpy.restore();
            fetchOptionsStub.restore();
            done();
        });
    });
});
