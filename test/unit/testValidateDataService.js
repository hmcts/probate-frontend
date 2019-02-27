'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const ValidateData = require('app/services/ValidateData');

describe('ValidateDataService', () => {
    describe('post()', () => {
        it('should call log() and fetchJson()', (done) => {
            const endpoint = 'http://localhost';
            const fetchOptions = {method: 'POST'};
            const validateData = new ValidateData(endpoint, 'abc123');
            const logSpy = sinon.spy(validateData, 'log');
            const fetchJsonSpy = sinon.spy(validateData, 'fetchJson');
            const fetchOptionsStub = sinon.stub(validateData, 'fetchOptions').returns(fetchOptions);

            validateData.post({dataTest: true}, 'ses123');

            expect(validateData.log.calledOnce).to.equal(true);
            expect(validateData.log.calledWith('Post validate data')).to.equal(true);
            expect(validateData.fetchJson.calledOnce).to.equal(true);
            expect(validateData.fetchJson.calledWith(endpoint, fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchJsonSpy.restore();
            fetchOptionsStub.restore();
            done();
        });
    });
});
