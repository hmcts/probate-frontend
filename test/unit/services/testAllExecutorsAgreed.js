'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const AllExecutorsAgreed = require('app/services/AllExecutorsAgreed');

describe('AllExecutorsAgreedService', () => {
    describe('get()', () => {
        it('should call log() and fetchText()', (done) => {
            const endpoint = 'http://localhost';
            const fetchOptions = {method: 'GET'};
            const ccdCaseId = '123';
            const authToken = 'authToken';
            const serviceAuthorisation = 'serviceAuthorisation';
            const allExecutorsAgreed = new AllExecutorsAgreed(endpoint, 'abc123');
            const logSpy = sinon.spy(allExecutorsAgreed, 'log');
            const fetchTextSpy = sinon.spy(allExecutorsAgreed, 'fetchText');
            const fetchOptionsStub = sinon.stub(allExecutorsAgreed, 'fetchOptions').returns(fetchOptions);

            allExecutorsAgreed.get(authToken, serviceAuthorisation, ccdCaseId);

            expect(allExecutorsAgreed.log.calledOnce).to.equal(true);
            expect(allExecutorsAgreed.log.calledWith('Get all executors agreed')).to.equal(true);
            expect(allExecutorsAgreed.fetchText.calledOnce).to.equal(true);
            expect(allExecutorsAgreed.fetchText.calledWith(`${endpoint}/invite/allAgreed/${ccdCaseId}`, fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchTextSpy.restore();
            fetchOptionsStub.restore();
            done();
        });
    });
});
