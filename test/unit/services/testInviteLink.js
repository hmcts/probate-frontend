'use strict';

const expect = require('chai').expect;
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
            expect(inviteLink.fetchJson.calledWith(`${endpoint}/invite/data/${inviteId}`, fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchJsonSpy.restore();
            fetchOptionsStub.restore();
            done();
        });
    });

    describe('post()', () => {
        it('should call log() and fetchText() when exec.inviteId is not given', (done) => {
            const endpoint = 'http://localhost';
            const fetchOptions = {method: 'POST'};
            const inviteLink = new InviteLink(endpoint, 'abc123');
            const logSpy = sinon.spy(inviteLink, 'log');
            const fetchJsonSpy = sinon.spy(inviteLink, 'fetchJson');
            const fetchOptionsStub = sinon.stub(inviteLink, 'fetchOptions').returns(fetchOptions);

            inviteLink.post({dataObject: true}, {execObject: true});

            expect(inviteLink.log.calledOnce).to.equal(true);
            expect(inviteLink.log.calledWith('Post invite link')).to.equal(true);
            expect(inviteLink.fetchJson.calledOnce).to.equal(true);
            expect(inviteLink.fetchJson.calledWith(`${endpoint}/invite`, fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchJsonSpy.restore();
            fetchOptionsStub.restore();
            done();
        });
    });

    describe('encodeURLNameParams()', () => {
        it('should encode each name parameter in the url', (done) => {
            const endpoint = 'http://localhost';
            const inviteLink = new InviteLink(endpoint, 'abc123');
            const invitation = {Name: 'Test Name'};
            const encodedInvitation = inviteLink.encodeURLNameParams(invitation);
            expect(encodedInvitation).to.deep.equal({Name: 'Test%20Name'});
            done();
        });
    });
});
