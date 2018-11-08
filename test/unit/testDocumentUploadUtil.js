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

        it('should return false when no document is given', (done) => {
            const documentUpload = new DocumentUpload();
            const isValidFile = documentUpload.isValidType();
            expect(isValidFile).to.equal(false);
            done();
        });
    });

    describe('isValidSize()', () => {
        it('should return true when a valid document size is given', (done) => {
            const document = {
                size: 2000000,
            };
            const documentUpload = new DocumentUpload();
            const isValidSize = documentUpload.isValidSize(document);
            expect(isValidSize).to.equal(true);
            done();
        });

        it('should return false when an invalid document size is given', (done) => {
            const document = {
                size: 12000000,
            };
            const documentUpload = new DocumentUpload();
            const isValidSize = documentUpload.isValidSize(document);
            expect(isValidSize).to.equal(false);
            done();
        });
    });

    describe('isValidNumber()', () => {
        it('should return true when the maximum number of files have been uploaded', (done) => {
            const uploads = Array(9).fill({file: 'death-certificate.pdf'});
            const documentUpload = new DocumentUpload();
            const isValidNumber = documentUpload.isValidNumber(uploads);
            expect(isValidNumber).to.equal(true);
            done();
        });

        it('should return true when no uploads are given', (done) => {
            const documentUpload = new DocumentUpload();
            const isValidNumber = documentUpload.isValidNumber();
            expect(isValidNumber).to.equal(true);
            done();
        });

        it('should return false when more than the maximum number of files have been uploaded', (done) => {
            const uploads = Array(10).fill({file: 'death-certificate.pdf'});
            const documentUpload = new DocumentUpload();
            const isValidNumber = documentUpload.isValidNumber(uploads);
            expect(isValidNumber).to.equal(false);
            done();
        });
    });

    describe('validate()', () => {
        it('should return null when a valid document is given', (done) => {
            const revert = DocumentUpload.__set__('fileType', () => ({mime: 'image/jpeg'}));
            const document = {
                buffer: 'valid',
                size: 2000000,
                mimetype: 'image/jpeg'
            };
            const uploads = [];
            const documentUpload = new DocumentUpload();
            const error = documentUpload.validate(document, uploads);
            expect(error).to.equal(null);
            revert();
            done();
        });

        it('should return an error when an invalid document type is given', (done) => {
            const document = {
                buffer: 'invalid',
                mimetype: 'application/msword'
            };
            const documentUpload = new DocumentUpload();
            const error = documentUpload.validate(document);
            expect(error).to.deep.equal({
                js: 'Save your file as a jpg, bmp, tiff, png or PDF file and try again',
                nonJs: 'type'
            });
            done();
        });

        it('should return an error when an invalid document size is given', (done) => {
            const revert = DocumentUpload.__set__('fileType', () => ({mime: 'image/jpeg'}));
            const document = {
                buffer: 'invalid',
                size: 12000000,
                mimetype: 'image/jpeg'
            };
            const documentUpload = new DocumentUpload();
            const error = documentUpload.validate(document);
            expect(error).to.deep.equal({
                js: 'Use a file that is under 10MB and try again',
                nonJs: 'maxSize'
            });
            revert();
            done();
        });

        it('should return an error when too many documents have been uploaded', (done) => {
            const revert = DocumentUpload.__set__('fileType', () => ({mime: 'image/jpeg'}));
            const document = {
                buffer: 'invalid',
                size: 2000,
                mimetype: 'image/jpeg'
            };
            const uploads = Array(10).fill({file: 'death-certificate.pdf'});
            const documentUpload = new DocumentUpload();
            const error = documentUpload.validate(document, uploads);
            expect(error).to.deep.equal({
                js: 'You can upload a maximum of 10 files',
                nonJs: 'maxFiles'
            });
            revert();
            done();
        });
    });
});
