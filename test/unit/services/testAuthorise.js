'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const Authorise = require('app/services/Authorise');

describe('AuthoriseService', () => {
    describe('post()', () => {
        it('should call log() and fetchText()', (done) => {
            const endpoint = '';
            const fetchOptions = {method: 'POST'};
            const authorise = new Authorise(endpoint, 'abc123');
            const logSpy = sinon.spy(authorise, 'log');
            const fetchTextSpy = sinon.stub(authorise, 'fetchText');
            const fetchOptionsStub = sinon.stub(authorise, 'fetchOptions').returns(fetchOptions);

            authorise.post();

            expect(authorise.log.calledOnce).to.equal(true);
            expect(authorise.log.calledWith('Post authorise')).to.equal(true);
            expect(authorise.fetchText.calledOnce).to.equal(true);
            expect(authorise.fetchText.calledWith(`${endpoint}/lease`, fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchTextSpy.restore();
            fetchOptionsStub.restore();
            done();
        });
    });
});
