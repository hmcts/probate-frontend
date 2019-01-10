'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const SubmitData = require('app/services/SubmitData');

describe('SubmitDataService', () => {
    describe('post()', () => {
        it('should call log() and fetchJson()', (done) => {
            const endpoint = 'http://localhost';
            const fetchOptions = {method: 'POST'};
            const logMessage = 'Post submit data';
            const submitData = new SubmitData(endpoint, 'abc123');
            const logSpy = sinon.spy(submitData, 'log');
            const fetchJsonSpy = sinon.spy(submitData, 'fetchJson');
            const fetchOptionsStub = sinon.stub(submitData, 'fetchOptions').returns(fetchOptions);

            submitData.post({ctxTest: true}, logMessage, endpoint);

            expect(submitData.log.calledOnce).to.equal(true);
            expect(submitData.log.calledWith(logMessage)).to.equal(true);
            expect(submitData.fetchJson.calledOnce).to.equal(true);
            expect(submitData.fetchJson.calledWith(endpoint, fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchJsonSpy.restore();
            fetchOptionsStub.restore();
            done();
        });
    });
});
