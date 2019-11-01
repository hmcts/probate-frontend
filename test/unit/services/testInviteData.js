'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const InviteData = require('app/services/InviteData');

describe('InviteDataService', () => {
    describe('updateContactDetails()', () => {
        it('should call log() and fetchJson()', (done) => {
            const endpoint = 'http://localhost';
            const fetchOptions = {method: 'POST'};
            const inviteId = 'inv123';
            const inviteData = new InviteData(endpoint, 'abc123');
            const logSpy = sinon.spy(inviteData, 'log');
            const fetchJsonSpy = sinon.spy(inviteData, 'fetchText');
            const fetchOptionsStub = sinon.stub(inviteData, 'fetchOptions').returns(fetchOptions);
            const ctx = {
                authToken: 'authToken',
                serviceAuthorization: 'serviceAuthToken',

            };

            inviteData.updateContactDetails(inviteId, {dataOptions: true}, ctx);

            expect(inviteData.log.calledOnce).to.equal(true);
            expect(inviteData.log.calledWith('Update contact details invite data')).to.equal(true);
            expect(inviteData.fetchText.calledOnce).to.equal(true);
            expect(inviteData.fetchText.calledWith(`${endpoint}/invite/contactdetails/${inviteId}`, fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchJsonSpy.restore();
            fetchOptionsStub.restore();
            done();
        });
    });
});
