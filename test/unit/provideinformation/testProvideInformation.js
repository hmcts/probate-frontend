'use strict';

const initSteps = require('app/core/initSteps');
const {assert} = require('chai');
const journeyProbate = require('../../../app/journeys/probate');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ProvideInformation = steps.ProvideInformation;
const CitizensHub = steps.CitizensHub;

describe('ProvideInformation', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ProvideInformation.constructor.getUrl();
            expect(url).to.equal('/provide-information');
            done();
        });
    });
    describe('nextStepOptions()', () => {
        it('should return the correct next step options', (done) => {
            const result = ProvideInformation.nextStepOptions();
            expect(result).to.deep.equal({
                options: [
                    {key: 'isUploadingDocument', value: 'true', choice: 'isUploadingDocument'}
                ]
            });
            done();
        });
    });
    describe('isComplete()', () => {
        it('should return the complete when documents uploaded', (done) => {
            const formdata = {
                documentupload: ['screenshot1.png', 'screenshot2.png']
            };
            const result = ProvideInformation.isComplete(formdata);
            const expectedTrue = [true, 'inProgress'];
            expect(result).to.deep.equal(expectedTrue);
            done();
        });
        it('should return complete false when no documents uploaded', (done) => {
            const formdata = {
            };
            const result = ProvideInformation.isComplete(formdata);
            const expectedFalse = [false, 'inProgress'];
            expect(result).to.deep.equal(expectedFalse);
            done();
        });
        it('should return complete true when documents have uploads', (done) => {
            const formdata = {
                documents: {uploads: [{filename: 'screenshot1.png'}, {filename: 'screenshot2.png'}]}
            };
            const result = ProvideInformation.isComplete(formdata);
            const expectedFalse = [true, 'inProgress'];
            expect(result).to.deep.equal(expectedFalse);
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                uploadedDocuments: ['screenshot1.png', 'screenshot2.png'],
                isUploadingDocument: true
            };
            const formdata = {
                uploadedDocuments: ['screenshot1.png', 'screenshot2.png'],
                isUploadingDocument: true
            };

            ProvideInformation.action(ctx, formdata);
            assert.isUndefined(ctx.uploadedDocuments);
            assert.isUndefined(ctx.isUploadingDocument);
        });
    });

    describe('getContextData()', () => {
        it('should return the context with uploaded documents', (done) => {
            const req = {
                session: {
                    form: {
                        documents: {
                            uploads: [{filename: 'screenshot1.png'}, {filename: 'screenshot2.png'}]
                        },
                        body: {
                            isUploadingDocument: true
                        }
                    }
                },
            };

            const ctx = ProvideInformation.getContextData(req);
            expect(ctx.uploadedDocuments).to.deep.equal(['screenshot1.png', 'screenshot2.png']);
            done();
        });
    });

    describe('handlePost()', () => {
        it('should return the context with errors', (done) => {
            const ctx = {
                uploadedDocuments: ['screenshot1.png', 'screenshot2.png'],
                isUploadingDocument: true
            };
            const errors = [];
            const formdata = {
                documents: {
                    error: 'file'
                }
            };
            const session = {language: 'en'};
            ProvideInformation.handlePost(ctx, errors, formdata, session);
            // eslint-disable-next-line no-undefined
            expect(errors).to.deep
                .equal([{field: 'file', href: '#file', msg: 'provideinformation.errors.file.file'}]);
            done();
        });
        it('should return an error when no citizenResponse/documentUploadIssue/uploadedDocuments', (done) => {
            const ctxToTest = {};
            const errorsToTest = [];
            const formdata = {};
            ProvideInformation.handlePost(ctxToTest, errorsToTest, formdata, {language: 'en'});
            expect(errorsToTest).to.deep.equal([{
                field: 'citizenResponse',
                href: '#citizenResponse',
                msg: 'You must either enter a response, upload a document, or tell us if you are having trouble uploading any documents'
            }]);
            done();
        });
        it('should return an error when an uploaded document is an invalid type', (done) => {
            const ctxToTest = {
                uploadedDocuments: ['screenshot1.png', 'screenshot2.png'],
                isUploadingDocument: true
            };
            const errorsToTest = [];
            const formdata = {
                documents: {
                    error: 'invalidFileType'
                }
            };
            ProvideInformation.handlePost(ctxToTest, errorsToTest, formdata, {language: 'en'});
            expect(errorsToTest).to.deep.equal([{
                field: 'file',
                href: '#file',
                msg: 'You have used a file type that can&rsquo;t be accepted. Save your file as a jpg, bmp, tiff, png or PDF file and try again'
            }]);
            done();
        });
        it('should return an error when an uploaded document is an invalid size', (done) => {
            const ctxToTest = {
                uploadedDocuments: ['screenshot1.png', 'screenshot2.png'],
                isUploadingDocument: true
            };
            const errorsToTest = [];
            const formdata = {
                documents: {
                    error: 'maxSize'
                }
            };
            ProvideInformation.handlePost(ctxToTest, errorsToTest, formdata, {language: 'en'});
            expect(errorsToTest).to.deep.equal([{
                field: 'file',
                href: '#file',
                msg: 'Your file is too large to upload. Use a file that is under 10MB and try again'
            }]);
            done();
        });
        describe('previousStepUrl()', () => {
            let ctx;
            it('should return the previous step url', (done) => {
                const res = {
                    redirect: (url) => url
                };
                const req = {
                    session: {
                        language: 'en',
                        form: {
                            language: {
                                bilingual: 'optionYes'
                            }
                        }
                    }
                };
                req.session.journey = journeyProbate;
                ctx = {};
                ProvideInformation.previousStepUrl(req, res, ctx);
                expect(ctx.previousUrl).to.equal(CitizensHub.constructor.getUrl());
                done();
            });
        });
    });
});
