'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const SubmitData = require('app/services/SubmitData');
const config = require('config');
const caseTypes = require('app/utils/CaseTypes');

describe('SubmitDataService', () => {
    describe('submit()', () => {
        it('should call super.put()', (done) => {
            const endpoint = '';
            const data = {ccdCase: {id: 1234567890123456, state: 'Pending'}};
            const paymentDto = {id: '123'};
            const fetchOptions = {method: 'PUT'};
            const authToken = 'authToken';
            const serviceAuthorisation = 'serviceAuthorisation';
            const submitData = new SubmitData(endpoint, 'abc123');
            const path = submitData.replacePlaceholderInPath(config.services.orchestrator.paths.submissions, 'ccdCaseId', data.ccdCase.id);

            const logSpy = sinon.spy(submitData, 'log');
            const fetchJsonSpy = sinon.stub(submitData, 'fetchJson');
            const fetchOptionsStub = sinon.stub(submitData, 'fetchOptions').returns(fetchOptions);

            const url = endpoint + path + '?probateType=PA';

            submitData.submit(data, paymentDto, authToken, serviceAuthorisation, caseTypes.GOP);

            expect(submitData.log.calledOnce).to.equal(true);
            expect(submitData.log.calledWith('Put submit data')).to.equal(true);
            expect(submitData.fetchJson.calledOnce).to.equal(true);
            expect(submitData.fetchJson.calledWith(url, fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchJsonSpy.restore();
            fetchOptionsStub.restore();
            done();
        });
    });
});
