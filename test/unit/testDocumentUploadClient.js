'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');

describe('document-upload client', () => {
    const documentUploadConfig = {
        content: {
            invalidFileType: 'Invalid file type',
            invalidFileTypeSummary: 'The file type is invalid',
            uploadFailed: 'The selected file could not be uploaded – try again.',
            uploadFailedSummary: 'Your document failed to upload'
        }
    };

    let DocumentUpload;
    let revertDocumentUploadConfig;

    beforeEach(() => {
        global.document = {};

        global.$ = sinon.stub().returns({
            ready: sinon.stub()
        });

        const documentUpload = rewire('app/assets/javascripts/document-upload.js');

        revertDocumentUploadConfig = documentUpload.__set__(
            'documentUploadConfig',
            documentUploadConfig
        );

        DocumentUpload = documentUpload.__get__('DocumentUpload');
    });

    afterEach(() => {
        revertDocumentUploadConfig();

        delete global.document;
        delete global.$;
    });

    it('should return null when there is no error', () => {
        expect(DocumentUpload.getDisplayError(null)).to.equal(null);
    });

    it('should preserve a recognised document upload error', () => {
        expect(
            DocumentUpload.getDisplayError('Invalid file type')
        ).to.equal('Invalid file type');
    });

    it('should return upload failed for an unexpected server error', () => {
        expect(
            DocumentUpload.getDisplayError('Server responded with 0 code.')
        ).to.equal(documentUploadConfig.content.uploadFailed);
    });

    it('should return upload failed for an unexpected HTML response', () => {
        expect(
            DocumentUpload.getDisplayError('<!DOCTYPE html><html>500</html>')
        ).to.equal(documentUploadConfig.content.uploadFailed);
    });

    it('should handle an error object containing a recognised message', () => {
        expect(
            DocumentUpload.getDisplayError({
                message: 'Invalid file type'
            })
        ).to.equal('Invalid file type');
    });
});
