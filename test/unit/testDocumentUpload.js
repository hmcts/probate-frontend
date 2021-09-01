'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const DocumentUpload = steps.DocumentUpload;
const content = require('app/resources/en/translation/documentupload');

describe('DocumentUpload.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const DocumentUpload = steps.DocumentUpload;
            const url = DocumentUpload.constructor.getUrl();
            expect(url).to.equal('/document-upload*');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return an array of uploaded documents when documents have been uploaded', (done) => {
            const req = {
                session: {
                    form: {
                        documents: {
                            uploads: [{
                                filename: 'death-certificate.pdf'
                            }]
                        }
                    }
                }
            };
            const DocumentUpload = steps.DocumentUpload;
            const ctx = DocumentUpload.getContextData(req);
            expect(ctx.uploadedDocuments).to.deep.equal([
                'death-certificate.pdf'
            ]);
            done();
        });

        it('should not set uploadedDocuments when req.session.form.documents.uploads does not exist', (done) => {
            const req = {
                session: {
                    form: {
                        documents: {}
                    }
                }
            };
            const DocumentUpload = steps.DocumentUpload;
            const ctx = DocumentUpload.getContextData(req);
            expect(Object.keys(ctx).includes('uploadedDocuments')).to.equal(false);
            done();
        });

        it('should not set uploadedDocuments when req.session.form.documents does not exist', (done) => {
            const req = {
                session: {
                    form: {}
                }
            };
            const DocumentUpload = steps.DocumentUpload;
            const ctx = DocumentUpload.getContextData(req);
            expect(Object.keys(ctx).includes('uploadedDocuments')).to.equal(false);
            done();
        });
    });

    describe('handlePost()', () => {
        it('should return the origininal ctx and errors when an uploaded document is valid', (done) => {
            const ctxToTest = {};
            const errorsToTest = [];
            const formdata = {
                documents: {}
            };
            const DocumentUpload = steps.DocumentUpload;
            const [ctx, errors] = DocumentUpload.handlePost(ctxToTest, errorsToTest, formdata);
            expect(ctx).to.deep.equal({});
            expect(errors).to.deep.equal([]);
            done();
        });

        it('should return an error when an uploaded document is an invalid type', (done) => {
            const ctxToTest = {};
            const errorsToTest = [];
            const formdata = {
                documents: {
                    error: 'invalidFileType'
                }
            };
            const DocumentUpload = steps.DocumentUpload;
            const [ctx, errors] = DocumentUpload.handlePost(ctxToTest, errorsToTest, formdata, {language: 'en'});
            expect(ctx).to.deep.equal({});
            expect(errors).to.deep.equal([{
                field: 'file',
                href: '#file',
                msg: content.errors.file.invalidFileType
            }]);
            done();
        });

        it('should return an error when an uploaded document is an invalid size', (done) => {
            const ctxToTest = {};
            const errorsToTest = [];
            const formdata = {
                documents: {
                    error: 'maxSize'
                }
            };
            const DocumentUpload = steps.DocumentUpload;
            const [ctx, errors] = DocumentUpload.handlePost(ctxToTest, errorsToTest, formdata, {language: 'en'});
            expect(ctx).to.deep.equal({});
            expect(errors).to.deep.equal([{
                field: 'file',
                href: '#file',
                msg: content.errors.file.maxSize
            }]);
            done();
        });

        it('should return an error when an uploaded document is an invalid size', (done) => {
            const ctxToTest = {};
            const errorsToTest = [];
            const formdata = {
                documents: {
                    error: 'maxSize'
                }
            };
            const DocumentUpload = steps.DocumentUpload;
            const [ctx, errors] = DocumentUpload.handlePost(ctxToTest, errorsToTest, formdata, {language: 'en'});
            expect(ctx).to.deep.equal({});
            expect(errors).to.deep.equal([{
                field: 'file',
                href: '#file',
                msg: content.errors.file.maxSize
            }]);
            done();
        });

        it('should return an error when an uploaded document is an invalid size', (done) => {
            const ctxToTest = {};
            const errorsToTest = [];
            const formdata = {
                documents: {
                    error: 'maxSize'
                }
            };
            const DocumentUpload = steps.DocumentUpload;
            const [ctx, errors] = DocumentUpload.handlePost(ctxToTest, errorsToTest, formdata, {language: 'en'});
            expect(ctx).to.deep.equal({});
            expect(errors).to.deep.equal([{
                field: 'file',
                href: '#file',
                msg: content.errors.file.maxSize
            }]);
            done();
        });

        it('should return an error when an uploaded document is an invalid size', (done) => {
            const ctxToTest = {};
            const errorsToTest = [];
            const formdata = {
                documents: {
                    error: 'maxSize'
                }
            };
            const DocumentUpload = steps.DocumentUpload;
            const [ctx, errors] = DocumentUpload.handlePost(ctxToTest, errorsToTest, formdata, {language: 'en'});
            expect(ctx).to.deep.equal({});
            expect(errors).to.deep.equal([{
                field: 'file',
                href: '#file',
                msg: content.errors.file.maxSize
            }]);
            done();
        });
    });

    describe('isComplete()', () => {
        let testCtx;

        beforeEach(() => {
            testCtx = {};
        });

        it('returns true if formdata has documentupload field', (done) => {
            const testFormdata = {
                documentupload: {},

            };
            const isComplete = DocumentUpload.isComplete(testCtx, testFormdata);
            expect(isComplete).to.deep.equal([true, 'inProgress']);
            done();
        });

        it('returns false if formdata does not have documentupload field', (done) => {
            const testFormdata = {};
            const isComplete = DocumentUpload.isComplete(testCtx, testFormdata);
            expect(isComplete).to.deep.equal([false, 'inProgress']);
            done();
        });
    });

    describe('action()', () => {
        it('should return ctx with uploadedDocuments removed and the original formdata', (done) => {
            const ctxToTest = {
                uploadedDocuments: []
            };
            const formdataToTest = {};
            const DocumentUpload = steps.DocumentUpload;
            const [ctx, formdata] = DocumentUpload.action(ctxToTest, formdataToTest);
            expect(ctx).to.deep.equal({});
            expect(formdata).to.deep.equal({});
            done();
        });
    });
});
