'use strict';

const initSteps = require('app/core/initSteps');
const {assert} = require('chai');
const journeyProbate = require('../../../app/journeys/probate');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ReviewResponse = steps.ReviewResponse;
const ProvideInformation = steps.ProvideInformation;
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
        const ctxTestData = {
            caseType: 'GOP',
            uploadedDocuments: ['screenshot1.png', 'screenshot2.png']
        };
        const errorsTestData = [];
        const formdata = {
            responseCheckbox: 'true'
        };
        const session = {
            language: 'en'
        };
        const hostname = 'localhost';

        it('Notify documents uploaded', async () => {

            // Call the handlePost function
            const [ctx, errors] = await ReviewResponse
                .handlePost(ctxTestData, errorsTestData, formdata, session, hostname);

            // Assertions
            expect(ctx).to.deep.equal(ctxTestData);
            expect(errors).to.deep.equal(errorsTestData);
            expect(session).to.deep.equal({
                language: 'en'
            });
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
                ReviewResponse.previousStepUrl(req, res, ctx);
                expect(ctx.previousUrl).to.equal(ProvideInformation.constructor.getUrl());
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
});
