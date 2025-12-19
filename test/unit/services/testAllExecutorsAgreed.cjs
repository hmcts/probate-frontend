'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const AllExecutorsAgreed = require('app/services/AllExecutorsAgreed');
const FormatUrl = require('app/utils/FormatUrl');
const AsyncFetch = require('app/utils/AsyncFetch');

describe('AllExecutorsAgreedService', () => {
    describe('get()', () => {
        it('should call log() and fetchText()', (done) => {
            const endpoint = '';
            const fetchOptions = {method: 'GET'};
            const ccdCaseId = '123';
            const authToken = 'authToken';
            const serviceAuthorisation = 'serviceAuthorisation';
            const allExecutorsAgreed = new AllExecutorsAgreed(endpoint, 'abc123');
            const logSpy = sinon.spy(allExecutorsAgreed, 'log');
            const fetchTextSpy = sinon.stub(allExecutorsAgreed, 'fetchText');
            const formatUrlStub = sinon.stub(FormatUrl, 'format').returns('/formattedUrl');
            const fetchOptionsStub = sinon.stub(AsyncFetch, 'fetchOptions').returns(fetchOptions);

            allExecutorsAgreed.get(authToken, serviceAuthorisation, ccdCaseId);

            expect(allExecutorsAgreed.log.calledOnce).to.equal(true);
            expect(allExecutorsAgreed.log.calledWith('Get all executors agreed')).to.equal(true);
            expect(formatUrlStub.calledWith(endpoint, `/invite/allAgreed/${ccdCaseId}`)).to.equal(true);
            expect(allExecutorsAgreed.fetchText.calledOnce).to.equal(true);
            expect(allExecutorsAgreed.fetchText.calledWith('/formattedUrl', fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchTextSpy.restore();
            fetchOptionsStub.restore();
            formatUrlStub.restore();
            done();
        });
    });
});
