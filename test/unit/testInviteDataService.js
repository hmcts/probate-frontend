'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const InviteData = require('app/services/InviteData');

describe('InviteDataService', () => {
    describe('patch()', () => {
        it('should call log() and fetchJson()', (done) => {
            const endpoint = 'http://localhost';
            const fetchOptions = {method: 'PATCH'};
            const inviteId = 'inv123';
            const inviteData = new InviteData(endpoint, 'abc123');
            const logSpy = sinon.spy(inviteData, 'log');
            const fetchJsonSpy = sinon.spy(inviteData, 'fetchJson');
            const fetchOptionsStub = sinon.stub(inviteData, 'fetchOptions').returns(fetchOptions);

            inviteData.patch(inviteId, {dataOptions: true});

            expect(inviteData.log.calledOnce).to.equal(true);
            expect(inviteData.log.calledWith('Patch invite data')).to.equal(true);
            expect(inviteData.fetchJson.calledOnce).to.equal(true);
            expect(inviteData.fetchJson.calledWith(`${endpoint}/invitedata/${inviteId}`, fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchJsonSpy.restore();
            fetchOptionsStub.restore();
            done();
        });
    });
});
