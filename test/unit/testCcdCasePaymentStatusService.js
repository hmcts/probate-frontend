'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const CcdCasePaymentStatus = require('app/services/CcdCasePaymentStatus');

describe('CcdCasePaymentStatusService', () => {
    describe('post()', () => {
        it('should call log() and fetchJson()', (done) => {
            const endpoint = 'http://localhost';
            const logMessage = 'Post CcdCasePaymentStatus';
            const fetchOptions = {method: 'POST'};
            const ccdCasePaymentStatus = new CcdCasePaymentStatus(endpoint, 'abc123');
            const logSpy = sinon.spy(ccdCasePaymentStatus, 'log');
            const fetchJsonSpy = sinon.spy(ccdCasePaymentStatus, 'fetchJson');
            const fetchOptionsStub = sinon.stub(ccdCasePaymentStatus, 'fetchOptions').returns(fetchOptions);

            ccdCasePaymentStatus.post({}, logMessage, endpoint, {});

            expect(ccdCasePaymentStatus.log.calledOnce).to.equal(true);
            expect(ccdCasePaymentStatus.log.calledWith(logMessage)).to.equal(true);
            expect(ccdCasePaymentStatus.fetchJson.calledOnce).to.equal(true);
            expect(ccdCasePaymentStatus.fetchJson.calledWith(endpoint, fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchJsonSpy.restore();
            fetchOptionsStub.restore();
            done();
        });
    });
});
