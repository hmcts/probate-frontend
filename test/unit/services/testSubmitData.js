'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const SubmitData = require('app/services/SubmitData');
const config = require('app/config');
const caseTypes = require('app/utils/CaseTypes');

describe('SubmitDataService', () => {
    describe('submit()', () => {
        it('should call super.put()', (done) => {
            const endpoint = 'http://localhost';
            const data = {ccdCase: {id: 1234567890123456, state: 'Draft'}};
            const paymentDto = {id: '123'};
            const fetchOptions = {method: 'PUT'};
            const authToken = 'authToken';
            const serviceAuthorisation = 'serviceAuthorisation';
            const submitData = new SubmitData(endpoint, 'abc123');
            const path = submitData.replacePlaceholderInPath(config.services.orchestrator.paths.submissions, 'ccdCaseId', data.ccdCase.id);

            const logSpy = sinon.spy(submitData, 'log');
            const fetchJsonSpy = sinon.spy(submitData, 'fetchJson');
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
