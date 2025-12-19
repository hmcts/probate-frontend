'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const Document = require('app/services/Document.cjs');
const FormatUrl = require('app/utils/FormatUrl.cjs');
const config = require('config');
const AsyncFetch = require('app/utils/AsyncFetch.cjs');

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
        it('should post call log() and fetchJson()', (done) => {
            const endpoint = '';
            const fetchOptions = {method: 'POST'};
            const caseId = '123';
            const response = 'true';
            const documentData = new Document(endpoint, 'abc123');
            const logSpy = sinon.spy(documentData, 'log');
            const fetchTextStub = sinon.stub(documentData, 'fetchText');
            const fetchOptionsStub = sinon.stub(AsyncFetch, 'fetchOptions').returns(fetchOptions);
            const formatUrlStub = sinon.stub(FormatUrl, 'format').returns('/formattedUrl');

            documentData.notifyApplicant(caseId, response);

            expect(documentData.log.calledOnce).to.equal(true);
            expect(documentData.log.calledWith('Notify Document upload')).to.equal(true);
            expect(formatUrlStub.calledOnce).to.equal(true);
            expect(formatUrlStub.calledWith(endpoint, `/documents/notification/${caseId}/${response}`)).to.equal(true);
            expect(fetchTextStub.calledOnce).to.equal(true);
            expect(fetchTextStub.calledWith('/formattedUrl', fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchTextStub.restore();
            fetchOptionsStub.restore();
            formatUrlStub.restore();
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
