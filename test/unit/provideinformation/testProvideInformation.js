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
            const ctx = {
                uploadedDocuments: ['screenshot1.png', 'screenshot2.png'],
                citizenResponse: 'response'
            };
            const result = ProvideInformation.nextStepOptions(ctx);
            expect(result).to.deep.equal({
                options: [
                    {key: 'responseOrDocument', value: true, choice: 'responseOrDocument'},
                    {key: 'isUploadingDocument', value: 'true', choice: 'isUploadingDocument'}
                ]
            });
            done();
        });
    });
    describe('isComplete()', () => {
        it('should return complete false when no documents uploaded', (done) => {
            const ctx = {
            };
            const result = ProvideInformation.isComplete(ctx);
            const expectedFalse = [false, 'inProgress'];
            expect(result).to.deep.equal(expectedFalse);
            done();
        });
        it('should return complete true when documents have uploads', (done) => {
            const ctx = {
                uploadedDocuments: ['screenshot1.png', 'screenshot2.png']
            };
            const result = ProvideInformation.isComplete(ctx);
            const expectedFalse = [true, 'inProgress'];
            expect(result).to.deep.equal(expectedFalse);
            done();
        });
        it('should return complete true when citizen response', (done) => {
            const ctx = {
                citizenResponse: 'response'
            };
            const result = ProvideInformation.isComplete(ctx);
            const expectedFalse = [true, 'inProgress'];
            expect(result).to.deep.equal(expectedFalse);
            done();
        });
        it('should return complete true when document upload issue is clicked', (done) => {
            const ctx = {documentUploadIssue: 'true'};
            const result = ProvideInformation.isComplete(ctx);
            const expectedFalse = [true, 'inProgress'];
            expect(result).to.deep.equal(expectedFalse);
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                uploadedDocuments: ['screenshot1.png', 'screenshot2.png'],
                isUploadingDocument: true,
                citizenResponse: 'response',
                documentUploadIssue: 'true'
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
                        provideinformation: {
                            citizenResponse: 'response',
                            documentUploadIssue: 'true'
                        },
                        body: {
                            isUploadingDocument: true
                        }
                    }
                },
            };

            const ctx = ProvideInformation.getContextData(req);
            expect(ctx.uploadedDocuments).to.deep.equal(['screenshot1.png', 'screenshot2.png']);
            expect(ctx.citizenResponse).to.deep.equal('response');
            expect(ctx.documentUploadIssue).to.deep.equal('true');
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
