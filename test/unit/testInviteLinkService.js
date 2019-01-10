'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const InviteLink = require('app/services/InviteLink');

describe('InviteLinkService', () => {
    describe('get()', () => {
        it('should call log() and fetchJson()', (done) => {
            const endpoint = 'http://localhost';
            const fetchOptions = {method: 'GET'};
            const inviteId = 'inv123';
            const inviteLink = new InviteLink(endpoint, 'abc123');
            const logSpy = sinon.spy(inviteLink, 'log');
            const fetchJsonSpy = sinon.spy(inviteLink, 'fetchJson');
            const fetchOptionsStub = sinon.stub(inviteLink, 'fetchOptions').returns(fetchOptions);

            inviteLink.get(inviteId);

            expect(inviteLink.log.calledOnce).to.equal(true);
            expect(inviteLink.log.calledWith('Get invite link')).to.equal(true);
            expect(inviteLink.fetchJson.calledOnce).to.equal(true);
            expect(inviteLink.fetchJson.calledWith(`${endpoint}/invitedata/${inviteId}`, fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchJsonSpy.restore();
            fetchOptionsStub.restore();
            done();
        });
    });

    describe('post()', () => {
        it('should call log() and fetchText() when exec.inviteId is given', (done) => {
            const endpoint = 'http://localhost';
            const fetchOptions = {method: 'POST'};
            const inviteId = 'inv123';
            const inviteLink = new InviteLink(endpoint, 'abc123');
            const logSpy = sinon.spy(inviteLink, 'log');
            const fetchTextSpy = sinon.spy(inviteLink, 'fetchText');
            const fetchOptionsStub = sinon.stub(inviteLink, 'fetchOptions').returns(fetchOptions);

            inviteLink.post({dataObject: true}, {inviteId: inviteId});

            expect(inviteLink.log.calledOnce).to.equal(true);
            expect(inviteLink.log.calledWith('Post invite link')).to.equal(true);
            expect(inviteLink.fetchText.calledOnce).to.equal(true);
            expect(inviteLink.fetchText.calledWith(`${endpoint}/invite/${inviteId}`, fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchTextSpy.restore();
            fetchOptionsStub.restore();
            done();
        });

        it('should call log() and fetchText()when exec.inviteId is not given', (done) => {
            const endpoint = 'http://localhost';
            const fetchOptions = {method: 'POST'};
            const inviteLink = new InviteLink(endpoint, 'abc123');
            const logSpy = sinon.spy(inviteLink, 'log');
            const fetchTextSpy = sinon.spy(inviteLink, 'fetchText');
            const fetchOptionsStub = sinon.stub(inviteLink, 'fetchOptions').returns(fetchOptions);

            inviteLink.post({dataObject: true}, {execObject: true});

            expect(inviteLink.log.calledOnce).to.equal(true);
            expect(inviteLink.log.calledWith('Post invite link')).to.equal(true);
            expect(inviteLink.fetchText.calledOnce).to.equal(true);
            expect(inviteLink.fetchText.calledWith(`${endpoint}/invite`, fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchTextSpy.restore();
            fetchOptionsStub.restore();
            done();
        });
    });
});
