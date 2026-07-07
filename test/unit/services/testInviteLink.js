'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const InviteLink = require('app/services/InviteLink');
const FormatUrl = require('app/utils/FormatUrl');
const AsyncFetch = require('app/utils/AsyncFetch');

let sandbox;
beforeEach(() => {
    sandbox = sinon.createSandbox();
});
afterEach(() => {
    sandbox.restore();
});

describe('InviteLinkService', () => {
    describe('get()', () => {
        it('should call log() and fetchJson()', (done) => {
            const endpoint = '';
            const fetchOptions = {method: 'GET'};
            const inviteId = 'inv123';
            const inviteLink = new InviteLink(endpoint, 'abc123');
            const logSpy = sandbox.spy(inviteLink, 'log');
            const fetchJsonStub = sandbox.stub(AsyncFetch, 'fetchJson');
            sandbox.stub(AsyncFetch, 'fetchOptions').returns(fetchOptions);
            const formatUrlStub = sandbox.stub(FormatUrl, 'format').returns('/formattedUrl');

            inviteLink.get(inviteId);

            expect(logSpy.calledOnce).to.equal(true);
            expect(logSpy.calledWith('Get invite link')).to.equal(true);
            expect(formatUrlStub.calledOnce).to.equal(true);
            expect(formatUrlStub.calledWith(endpoint, `/invite/data/${inviteId}`)).to.equal(true);
            expect(fetchJsonStub.calledOnce).to.equal(true);
            expect(fetchJsonStub.calledWith('/formattedUrl', fetchOptions)).to.equal(true);
            done();
        });
    });

    describe('post()', () => {
        it('should call log() and fetchJson() with params in data array when inviteId is not provided',
            (done) => {
                const endpoint = '';
                const fetchOptions = {method: 'POST'};
                const inviteLink = new InviteLink(endpoint, 'abc123');
                const logSpy = sandbox.spy(inviteLink, 'log');
                const fetchJsonSpy = sandbox.stub(AsyncFetch, 'fetchJson');
                sandbox.stub(AsyncFetch, 'fetchOptions').returns(fetchOptions);
                const formatUrlStub = sandbox.stub(FormatUrl, 'format').returns('/formattedUrl');
                const data = [
                    {Name: 'Test Name', email: 'john.doe@example.com'},
                    {FirstName: 'John Doe', LastName: 'Smith'}
                ];
                inviteLink.post(data, {execObject: true});
                expect(logSpy.calledOnce).to.equal(true);
                expect(logSpy.calledWith('Post invite link')).to.equal(true);
                expect(formatUrlStub.calledOnce).to.equal(true);
                expect(formatUrlStub.calledWith(endpoint, '/invite')).to.equal(true);
                expect(fetchJsonSpy.calledOnce).to.equal(true);
                expect(fetchJsonSpy.calledWith('/formattedUrl', fetchOptions)).to.equal(true);
                done();
            });
    });
});
