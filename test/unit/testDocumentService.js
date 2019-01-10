'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const Document = require('app/services/Document');
const config = require('app/config');

describe('DocumentService', () => {
    describe('post()', () => {
        it('should call log()', (done) => {
            const document = new Document('http://localhost', 'abc123');
            const logSpy = sinon.spy(document, 'log');

            document.post('user123', {});

            expect(document.log.calledOnce).to.equal(true);
            expect(document.log.calledWith('Post document')).to.equal(true);

            logSpy.restore();
            done();
        });
    });

    describe('delete()', () => {
        it('should call log() and fetchText()', (done) => {
            const endpoint = 'http://localhost';
            const fetchOptions = {method: 'DELETE'};
            const document = new Document(endpoint, 'abc123');
            const logSpy = sinon.spy(document, 'log');
            const fetchTextSpy = sinon.spy(document, 'fetchText');
            const fetchOptionsStub = sinon.stub(document, 'fetchOptions').returns(fetchOptions);

            document.delete('doc123', 'user123');

            expect(document.log.calledOnce).to.equal(true);
            expect(document.log.calledWith('Delete document')).to.equal(true);
            expect(document.fetchText.calledOnce).to.equal(true);
            expect(document.fetchText.calledWith(`${endpoint}${config.documentUpload.paths.remove}/doc123`, fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchTextSpy.restore();
            fetchOptionsStub.restore();
            done();
        });
    });
});
