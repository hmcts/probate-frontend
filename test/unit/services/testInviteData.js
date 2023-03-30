'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const InviteData = require('app/services/InviteData');
const FormatUrl = require('app/utils/FormatUrl');
const AsyncFetch = require('app/utils/AsyncFetch');

describe('InviteDataService', () => {
    describe('updateContactDetails()', () => {
        it('should call log() and fetchJson()', (done) => {
            const endpoint = '';
            const fetchOptions = {method: 'POST'};
            const inviteId = 'inv123';
            const inviteData = new InviteData(endpoint, 'abc123');
            const logSpy = sinon.spy(inviteData, 'log');
            const fetchTextStub = sinon.stub(inviteData, 'fetchText');
            const formatUrlStub = sinon.stub(FormatUrl, 'format').returns('/formattedUrl');
            const fetchOptionsStub = sinon.stub(AsyncFetch, 'fetchOptions').returns(fetchOptions);
            const ctx = {
                authToken: 'authToken',
                serviceAuthorization: 'serviceAuthToken',

            };

            inviteData.updateContactDetails(inviteId, {dataOptions: true}, ctx);

            expect(inviteData.log.calledOnce).to.equal(true);
            expect(inviteData.log.calledWith('Update contact details invite data')).to.equal(true);
            expect(formatUrlStub.calledOnce).to.equal(true);
            expect(formatUrlStub.calledWith(endpoint, `/invite/contactdetails/${inviteId}`)).to.equal(true);
            expect(fetchTextStub.calledOnce).to.equal(true);
            expect(fetchTextStub.calledWith('/formattedUrl', fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchTextStub.restore();
            formatUrlStub.restore();
            fetchOptionsStub.restore();
            done();
        });
    });
});
