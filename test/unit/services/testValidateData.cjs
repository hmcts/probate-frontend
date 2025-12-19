'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const ValidateData = require('app/services/ValidateData.cjs');
const caseTypes = require('app/utils/CaseTypes.cjs');
const AsyncFetch = require('app/utils/AsyncFetch.cjs');

describe('ValidateData', () => {
    describe('put()', () => {
        it('should call log() and fetchJson()', (done) => {
            const endpoint = '';
            const url = '/forms/1234567890123456/validations?probateType=PA';
            const fetchOptions = {method: 'PUT'};
            const data = {ccdCase: {id: 1234567890123456}};
            const validateData = new ValidateData(endpoint, 'abc123');

            const logSpy = sinon.spy(validateData, 'log');
            const fetchJsonStub = sinon.stub(AsyncFetch, 'fetchJson');
            const fetchOptionsStub = sinon.stub(AsyncFetch, 'fetchOptions').returns(fetchOptions);

            validateData.put(data, 'auth', 'ses123', caseTypes.GOP);

            expect(validateData.log.calledOnce).to.equal(true);
            expect(validateData.log.calledWith('Post validate data')).to.equal(true);
            expect(AsyncFetch.fetchJson.calledOnce).to.equal(true);
            expect(AsyncFetch.fetchJson.calledWith(url, fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchJsonStub.restore();
            fetchOptionsStub.restore();
            done();
        });
    });
});
