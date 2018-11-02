'use strict';

const expect = require('chai').expect;
const rewire = require('rewire');
const DocumentUpload = rewire('app/utils/DocumentUpload');

describe('DocumentUploadUtil', () => {
    describe('initDocuments()', () => {
        it('should return formdata.documents when formdata.documents does not exist', (done) => {
            const testFormdata = {};
            const documentUpload = new DocumentUpload();
            const formdata = documentUpload.initDocuments(testFormdata);
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
            const documentUpload = new DocumentUpload();
            const formdata = documentUpload.initDocuments(testFormdata);
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
            const uploadedDocument = {
                originalname: 'death-certificate.pdf'
            };
            const testUploads = [{
                filename: 'will.pdf'
            }];
            const documentUpload = new DocumentUpload();
            const uploads = documentUpload.addDocument(uploadedDocument, testUploads);
            expect(uploads).to.deep.equal([{
                filename: 'will.pdf'
            }, {
                filename: 'death-certificate.pdf'
            }]);
            done();
        });

        it('should return an array of documents without an undefined value when a document is not given', (done) => {
            const uploadedDocument = {};
            const testUploads = [{
                filename: 'will.pdf'
            }];
            const documentUpload = new DocumentUpload();
            const uploads = documentUpload.addDocument(uploadedDocument, testUploads);
            expect(uploads).to.deep.equal([{
                filename: 'will.pdf'
            }]);
            done();
        });

        it('should create and return an array of documents when an array of documents does not exist and a document is given', (done) => {
            const uploadedFile = {
                originalname: 'death-certificate.pdf'
            };
            const documentUpload = new DocumentUpload();
            const uploads = documentUpload.addDocument(uploadedFile);
            expect(uploads).to.deep.equal([{
                filename: 'death-certificate.pdf'
            }]);
            done();
        });
    });

    describe('removeDocument()', () => {
        it('should return an array of documents with a document removed when an index is given', (done) => {
            const index = 0;
            const testUploads = [{
                filename: 'will.pdf'
            }, {
                filename: 'death-certificate.pdf'
            }];
            const documentUpload = new DocumentUpload();
            const uploads = documentUpload.removeDocument(index, testUploads);
            expect(uploads).to.deep.equal([{
                filename: 'death-certificate.pdf'
            }]);
            done();
        });

        it('should return an array of documents without removing a document when a non-numeric index is given', (done) => {
            const index = 'one';
            const testUploads = [{
                filename: 'will.pdf'
            }, {
                filename: 'death-certificate.pdf'
            }];
            const documentUpload = new DocumentUpload();
            const uploads = documentUpload.removeDocument(index, testUploads);
            expect(uploads).to.deep.equal([{
                filename: 'will.pdf'
            }, {
                filename: 'death-certificate.pdf'
            }]);
            done();
        });

        it('should not fail when an index is given but not an array of documents', (done) => {
            const index = 0;
            const documentUpload = new DocumentUpload();
            const uploads = documentUpload.removeDocument(index);
            expect(uploads).to.deep.equal([]);
            done();
        });
    });

    describe('isValidType()', () => {
        it('should return true when a valid document type is given', (done) => {
            const revert = DocumentUpload.__set__('fileType', () => ({mime: 'image/jpeg'}));
            const document = {
                buffer: 'valid',
                mimetype: 'image/jpeg'
            };
            const documentUpload = new DocumentUpload();
            const isValidFile = documentUpload.isValidType(document);
            expect(isValidFile).to.equal(true);
            revert();
            done();
        });

        it('should return false when no document type is found', (done) => {
            const revert = DocumentUpload.__set__('fileType', () => null);
            const document = {
                buffer: 'invalid',
                mimetype: 'image/jpeg'
            };
            const documentUpload = new DocumentUpload();
            const isValidFile = documentUpload.isValidType(document);
            expect(isValidFile).to.equal(false);
            revert();
            done();
        });

        it('should return false when a document with an invalid buffer is found', (done) => {
            const revert = DocumentUpload.__set__('fileType', () => ({mime: 'test/plain'}));
            const document = {
                buffer: 'invalid',
                mimetype: 'image/jpeg'
            };
            const documentUpload = new DocumentUpload();
            const isValidFile = documentUpload.isValidType(document);
            expect(isValidFile).to.equal(false);
            revert();
            done();
        });

        it('should return false when an invalid document type is found', (done) => {
            const document = {
                buffer: 'invalid',
                mimetype: 'text/plain'
            };
            const documentUpload = new DocumentUpload();
            const isValidFile = documentUpload.isValidType(document);
            expect(isValidFile).to.equal(false);
            done();
        });
    });

    describe('isDocumentValid()', () => {
        it('should return true when a valid document type is given', (done) => {
            const revert = DocumentUpload.__set__('fileType', () => ({mime: 'image/jpeg'}));
            const document = {
                buffer: 'valid',
                mimetype: 'image/jpeg'
            };
            const documentUpload = new DocumentUpload();
            const isDocumentValid = documentUpload.isDocumentValid(document);
            expect(isDocumentValid).to.equal(true);
            revert();
            done();
        });

        it('should return false when an invalid document type is given', (done) => {
            const document = {
                buffer: 'invalid'
            };
            const documentUpload = new DocumentUpload();
            const isDocumentValid = documentUpload.isDocumentValid(document);
            expect(isDocumentValid).to.equal(false);
            done();
        });
    });
});
