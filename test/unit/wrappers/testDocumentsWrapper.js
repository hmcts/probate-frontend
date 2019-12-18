'use strict';

const DocumentsWrapper = require('app/wrappers/Documents');
const expect = require('chai').expect;

describe('Documents.js', () => {
    describe('documentsSent()', () => {
        it('should return true if documents have been sent', (done) => {
            const data = {sentDocuments: 'true'};
            const documentsWrapper = new DocumentsWrapper(data);
            expect(documentsWrapper.documentsSent()).to.equal(true);
            done();
        });

        it('should return false if the documents have not been sent', (done) => {
            const data = {sentDocuments: 'false'};
            const documentsWrapper = new DocumentsWrapper(data);
            expect(documentsWrapper.documentsSent()).to.equal(false);
            done();
        });
    });
});
