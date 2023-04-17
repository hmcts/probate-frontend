'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const Document = require('app/services/Document');
const FormatUrl = require('app/utils/FormatUrl');
const config = require('config');
const AsyncFetch = require('app/utils/AsyncFetch');

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
            const endpoint = '';
            const fetchOptions = {method: 'DELETE'};
            const document = new Document(endpoint, 'abc123');
            const logSpy = sinon.spy(document, 'log');
            const fetchTextSpy = sinon.stub(document, 'fetchText');
            const formatUrlStub = sinon.stub(FormatUrl, 'format').returns('/formattedUrl');
            const fetchOptionsStub = sinon.stub(AsyncFetch, 'fetchOptions').returns(fetchOptions);

            document.delete('doc123', 'user123');

            expect(document.log.calledOnce).to.equal(true);
            expect(document.log.calledWith('Delete document')).to.equal(true);
            expect(formatUrlStub.calledWith(endpoint, `${endpoint}${config.documentUpload.paths.remove}/doc123`)).to.equal(true);
            expect(document.fetchText.calledOnce).to.equal(true);
            expect(document.fetchText.calledWith('/formattedUrl', fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchTextSpy.restore();
            fetchOptionsStub.restore();
            formatUrlStub.restore();
            done();
        });
    });
});
