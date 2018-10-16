'use strict';

const DocumentUpload = require('app/utils/DocumentUpload');
const expect = require('chai').expect;

describe('DocumentUpload.js', () => {
    describe('initDocuments()', () => {
        it('should return formdata.documents when formdata.documents does not exist', (done) => {
            const testFormdata = {};
            const formdata = DocumentUpload.initDocuments(testFormdata);
            expect(formdata).to.deep.equal({
                documents: {}
            });
            done();
        });

        it('should return the original formdata.documents when formdata.documents exists', (done) => {
            const testFormdata = {
                documents: {
                    sentDocuments: true
                }
            };
            const formdata = DocumentUpload.initDocuments(testFormdata);
            expect(formdata).to.deep.equal({
                documents: {
                    sentDocuments: true
                }
            });
            done();
        });
    });

    describe('addDocument()', () => {
        it('should return an array of documents containing a new document when a document is given', (done) => {
            const uploadedFile = 'death-certificate.pdf';
            const testUploads = [
                'will.pdf'
            ];
            const uploads = DocumentUpload.addDocument(uploadedFile, testUploads);
            expect(uploads).to.deep.equal([
                'will.pdf',
                'death-certificate.pdf'
            ]);
            done();
        });

        it('should return an array of documents without an undefined value when a document is not given', (done) => {
            const uploadedFile = null;
            const testUploads = [
                'will.pdf'
            ];
            const uploads = DocumentUpload.addDocument(uploadedFile, testUploads);
            expect(uploads).to.deep.equal([
                'will.pdf'
            ]);
            done();
        });

        it('should create and return an array of documents when an array of documents does not exist and a document is given', (done) => {
            const uploadedFile = 'death-certificate.pdf';
            const uploads = DocumentUpload.addDocument(uploadedFile);
            expect(uploads).to.deep.equal([
                'death-certificate.pdf'
            ]);
            done();
        });
    });
});
