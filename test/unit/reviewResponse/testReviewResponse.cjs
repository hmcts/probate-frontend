'use strict';

const initSteps = require('app/core/initSteps');
const {assert} = require('chai');
const {stub} = require('sinon');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ReviewResponse = steps.ReviewResponse;
const Document = require('app/services/Document');
describe('ReviewResponse', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ReviewResponse.constructor.getUrl();
            expect(url).to.equal('/review-response');
            done();
        });
    });
    describe('isComplete()', () => {
        it('should return the complete when checkbox is clicked', (done) => {
            const formdata = {
                reviewresponse: {
                    citizenResponseCheckbox: 'true'
                }
            };
            const ctx = {citizenResponseCheckbox: true};
            const result = ReviewResponse.isComplete(ctx, formdata);
            const expectedTrue = [true, 'inProgress'];
            expect(result).to.deep.equal(expectedTrue);
            done();
        });
        it('should return complete false when no checkbox is clicked', (done) => {
            const formdata = {
            };
            const ctx = {};
            const result = ReviewResponse.isComplete(ctx, formdata);
            const expectedFalse = [false, 'inProgress'];
            expect(result).to.deep.equal(expectedFalse);
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                uploadedDocuments: ['screenshot1.png', 'screenshot2.png'],
                citizenResponse: true
            };
            const formdata = {
                uploadedDocuments: ['screenshot1.png', 'screenshot2.png'],
                citizenResponse: true
            };

            ReviewResponse.action(ctx, formdata);
            assert.isUndefined(ctx.uploadedDocuments);
            assert.isUndefined(ctx.citizenResponse);
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
                            documentUploadIssue: 'false'
                        }
                    }
                },
            };

            const ctx = ReviewResponse.getContextData(req);
            expect(ctx.uploadedDocuments).to.deep.equal(['screenshot1.png', 'screenshot2.png']);
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;
        let formdata;
        let session;

        beforeEach(() => {
            ctx = {};
            errors = [];
            formdata = {};
            session = {
                authToken: 'authToken',
                serviceAuthorization: 'serviceAuthorization'
            };
        });

        it('should notify applicant and set expected response date when citizenResponseCheckbox is true', async () => {
            ctx.citizenResponseCheckbox = 'true';
            ctx.sessionID = 'sessionID';
            ctx.ccdCase = {id: 'caseId'};

            const documentStub = stub(Document.prototype, 'notifyApplicant').resolves({});

            await ReviewResponse.handlePost(ctx, errors, formdata, session);

            // eslint-disable-next-line no-unused-expressions
            expect(documentStub.calledOnce).to.be.true;
            // eslint-disable-next-line no-unused-expressions
            expect(documentStub.calledWith('caseId', 'true', 'authToken', 'serviceAuthorization')).to.be.true;

            documentStub.restore();
        });

        it('should not notify applicant or set expected response date when citizenResponseCheckbox is not true', async () => {
            ctx.citizenResponseCheckbox = 'false';

            const documentStub = stub(Document.prototype, 'notifyApplicant');

            await ReviewResponse.handlePost(ctx, errors, formdata, session);

            // eslint-disable-next-line no-unused-expressions
            expect(documentStub.notCalled).to.be.true;
            // eslint-disable-next-line no-unused-expressions
            expect(ctx.expectedResponseDate).to.be.undefined;

            documentStub.restore();
        });
    });

    describe('shouldHaveBackLink()', () => {
        it('should have a back link', (done) => {
            const actual = ReviewResponse.shouldHaveBackLink();
            expect(actual).to.equal(true);
            done();
        });
    });

    describe('shouldPersistFormData()', () => {
        it('should return false', () => {
            const persist = ReviewResponse.shouldPersistFormData();
            expect(persist).to.equal(false);
        });
    });
});
