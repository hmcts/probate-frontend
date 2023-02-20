'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const IdamSession = require('app/services/IdamSession');

describe('IdamSessionService', () => {
    describe('get()', () => {
        it('should call log() and fetchJson()', (done) => {
            const endpoint = '';
            const fetchOptions = {method: 'GET'};
            const idamSession = new IdamSession(endpoint, 'abc123');
            const logSpy = sinon.spy(idamSession, 'log');
            const fetchJsonSpy = sinon.stub(idamSession, 'fetchJson');
            const fetchOptionsStub = sinon.stub(idamSession, 'fetchOptions').returns(fetchOptions);

            idamSession.get('sec123');

            expect(idamSession.log.calledOnce).to.equal(true);
            expect(idamSession.log.calledWith('Get idam session')).to.equal(true);
            expect(idamSession.fetchJson.calledOnce).to.equal(true);
            expect(idamSession.fetchJson.calledWith(`${endpoint}/details`, fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchJsonSpy.restore();
            fetchOptionsStub.restore();
            done();
        });
    });

    describe('delete()', () => {
        it('should call log() and fetchJson()', (done) => {
            const endpoint = '';
            const fetchOptions = {method: 'DELETE'};
            const accessToken = 'acc123';
            const idamSession = new IdamSession(endpoint, 'abc123');
            const logSpy = sinon.spy(idamSession, 'log');
            const fetchJsonSpy = sinon.stub(idamSession, 'fetchJson');
            const fetchOptionsStub = sinon.stub(idamSession, 'fetchOptions').returns(fetchOptions);

            idamSession.delete(accessToken);

            expect(idamSession.log.calledOnce).to.equal(true);
            expect(idamSession.log.calledWith('Delete idam session')).to.equal(true);
            expect(idamSession.fetchJson.calledOnce).to.equal(true);
            expect(idamSession.fetchJson.calledWith(`${endpoint}/session/${accessToken}`, fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchJsonSpy.restore();
            fetchOptionsStub.restore();
            done();
        });
    });
});
