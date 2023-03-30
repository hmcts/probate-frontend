'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const InviteLink = require('app/services/InviteLink');
const FormatUrl = require('app/utils/FormatUrl');
const AsyncFetch = require('app/utils/AsyncFetch');

describe('InviteLinkService', () => {
    describe('get()', () => {
        it('should call log() and fetchJson()', (done) => {
            const endpoint = '';
            const fetchOptions = {method: 'GET'};
            const inviteId = 'inv123';
            const inviteLink = new InviteLink(endpoint, 'abc123');
            const logSpy = sinon.spy(inviteLink, 'log');
            const fetchJsonStub = sinon.stub(AsyncFetch, 'fetchJson');
            const fetchOptionsStub = sinon.stub(AsyncFetch, 'fetchOptions').returns(fetchOptions);
            const formatUrlStub = sinon.stub(FormatUrl, 'format').returns('/formattedUrl');

            inviteLink.get(inviteId);

            expect(inviteLink.log.calledOnce).to.equal(true);
            expect(inviteLink.log.calledWith('Get invite link')).to.equal(true);
            expect(formatUrlStub.calledOnce).to.equal(true);
            expect(formatUrlStub.calledWith(endpoint, `/invite/data/${inviteId}`)).to.equal(true);
            expect(AsyncFetch.fetchJson.calledOnce).to.equal(true);
            expect(AsyncFetch.fetchJson.calledWith('/formattedUrl', fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchJsonStub.restore();
            fetchOptionsStub.restore();
            formatUrlStub.restore();
            done();
        });
    });

    describe('post()', () => {
        it('should call log() and fetchText() when exec.inviteId is not given', (done) => {
            const endpoint = '';
            const fetchOptions = {method: 'POST'};
            const inviteLink = new InviteLink(endpoint, 'abc123');
            const logSpy = sinon.spy(inviteLink, 'log');
            const fetchJsonSpy = sinon.stub(AsyncFetch, 'fetchJson');
            const fetchOptionsStub = sinon.stub(AsyncFetch, 'fetchOptions').returns(fetchOptions);
            const formatUrlStub = sinon.stub(FormatUrl, 'format').returns('/formattedUrl');

            inviteLink.post({dataObject: true}, {execObject: true});

            expect(inviteLink.log.calledOnce).to.equal(true);
            expect(inviteLink.log.calledWith('Post invite link')).to.equal(true);
            expect(formatUrlStub.calledOnce).to.equal(true);
            expect(formatUrlStub.calledWith(endpoint, '/invite')).to.equal(true);
            expect(AsyncFetch.fetchJson.calledOnce).to.equal(true);
            expect(AsyncFetch.fetchJson.calledWith('/formattedUrl', fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchJsonSpy.restore();
            fetchOptionsStub.restore();
            formatUrlStub.restore();
            done();
        });
    });

    describe('encodeURLNameParams()', () => {
        it('should encode each name parameter in the url', (done) => {
            const endpoint = '';
            const inviteLink = new InviteLink(endpoint, 'abc123');
            const invitation = {Name: 'Test Name'};
            const encodedInvitation = inviteLink.encodeURLNameParams(invitation);
            expect(encodedInvitation).to.deep.equal({Name: 'Test%20Name'});
            done();
        });
    });
});
