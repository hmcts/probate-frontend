'use strict';

const initSteps = require('app/core/initSteps');
const {assert} = require('chai');
const {stub} = require('sinon');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ProvideInformation = steps.ProvideInformation;
const Document = require('app/services/Document');
const content = require('app/resources/en/translation/provideinformation');

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
                    error: 'nothingUploaded'
                }
            };
            const session = {language: 'en',
                form: {
                    documents: { }
                }
            };
            ProvideInformation.handlePost(ctx, errors, formdata, session);
            // eslint-disable-next-line no-undefined
            expect(errors).to.deep
                .equal([{field: 'file', href: '#file', msg: content.errors.file.nothingUploaded}]);
            done();
        });
        it('should return an error when no citizenResponse/documentUploadIssue/uploadedDocuments', (done) => {
            const ctxToTest = {};
            const errorsToTest = [];
            const formdata = {};
            const session = {language: 'en',
                form: {
                    documents: { }
                }
            };
            ProvideInformation.handlePost(ctxToTest, errorsToTest, formdata, session);
            expect(errorsToTest).to.deep.equal([{
                field: 'citizenResponse',
                href: '#citizenResponse',
                msg: content.errors.citizenResponse.required
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
            const session = {language: 'en',
                form: {
                    documents: { }
                }
            };
            ProvideInformation.handlePost(ctxToTest, errorsToTest, formdata, session);
            expect(errorsToTest).to.deep.equal([{
                field: 'file',
                href: '#file',
                msg: content.errors.file.invalidFileType
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
            const session = {language: 'en',
                form: {
                    documents: { }
                }
            };
            ProvideInformation.handlePost(ctxToTest, errorsToTest, formdata, session);
            expect(errorsToTest).to.deep.equal([{
                field: 'file',
                href: '#file',
                msg: content.errors.file.maxSize
            }]);
            done();
        });
        it('Notify documents uploaded', async () => {
            const ctxTestData = {
                caseType: 'GOP'
            };
            const errorsTestData = [];
            const formdata = {
                documentUploadIssue: 'true'
            };
            const session = {language: 'en',
                form: {
                    documents: { }
                }
            };
            const hostname = 'localhost';
            // Call the handlePost function
            const [ctx, errors] = await ProvideInformation
                .handlePost(ctxTestData, errorsTestData, formdata, session, hostname);

            // Assertions
            expect(ctx).to.deep.equal(ctxTestData);
            expect(errors).to.deep.equal(errorsTestData);
            expect(session).to.deep.equal({
                language: 'en',
                form: {
                    documents: { }
                }
            });
        });
    });

    describe('shouldHaveBackLink()', () => {
        it('should have a back link', (done) => {
            const actual = ProvideInformation.shouldHaveBackLink();
            expect(actual).to.equal(true);
            done();
        });
    });

    describe('handlePost', () => {
        let ctx;
        let errors;
        let formdata;
        let session;

        beforeEach(() => {
            ctx = {};
            errors = [];
            formdata = {documents: {}};
            session = {authToken: 'authToken', serviceAuthorization: 'serviceAuthorization', form: {documents: { }}};
        });

        it('sends notification if documentUploadIssue is true and no document is being uploaded', async () => {
            ctx.documentUploadIssue = 'true';
            ctx.isUploadingDocument = 'false';
            ctx.citizenResponse = '';
            ctx.sessionID = 'sessionID';
            ctx.ccdCase = {id: 'caseId'};

            const documentStub = stub(Document.prototype, 'notifyApplicant').resolves({name: 'Success'});

            await ProvideInformation.handlePost(ctx, errors, formdata, session);
            // eslint-disable-next-line no-unused-expressions
            expect(documentStub.calledOnce).to.be.true;
            // eslint-disable-next-line no-unused-expressions
            expect(documentStub.calledWith('caseId', 'false', 'authToken', 'serviceAuthorization')).to.be.true;

            documentStub.restore();
        });
        it('does not send notification if documentUploadIssue is false', async () => {
            ctx.documentUploadIssue = 'false';
            ctx.isUploadingDocument = 'false';
            ctx.citizenResponse = '';
            ctx.sessionID = 'sessionID';
            ctx.ccdCase = {id: 'caseId'};

            const documentStub = stub(Document.prototype, 'notifyApplicant');

            await ProvideInformation.handlePost(ctx, errors, formdata, session);
            // eslint-disable-next-line no-unused-expressions
            expect(documentStub.notCalled).to.be.true;

            documentStub.restore();
        });
    });
});
