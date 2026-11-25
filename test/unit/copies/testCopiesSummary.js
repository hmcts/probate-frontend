'use strict';

const initSteps = require('app/core/initSteps');
const coreContextMockData = require('../../data/core-context-mock-data.json');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const CopiesSummary = steps.CopiesSummary;

describe('CopiesSummary', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = CopiesSummary.constructor.getUrl();
            expect(url).to.equal('/copies-summary');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the ctx with passedPayment', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {
                    language: 'en',
                    form: {
                        caseType: 'gop',
                        ccdCase: {
                            id: 1234567890123456,
                            state: 'Pending'
                        },
                        payment: {
                            reference: '1234'
                        }
                    },
                    caseType: 'gop'
                }
            };
            const ctx = CopiesSummary.getContextData(req);
            expect(ctx).to.deep.equal({
                ...coreContextMockData,
                assetsOverseasQuestion: 'Did  have assets outside the UK?',
                passedPayment: true,
                sessionID: 'dummy_sessionId'
            });
            done();
        });
    });

    describe('generateFields()', () => {
        it('it should set Google analytics enabled to true', (done) => {
            const ctx = {
                session: {
                    form: {},
                },
                isGaEnabled: true
            };
            const fields = CopiesSummary.generateFields('en', ctx, [], {});
            expect(fields.isGaEnabled.value).to.deep.equal('true');
            done();
        });

        it('it should set Google analytics enabled to false', (done) => {
            const ctx = {
                session: {
                    form: {},
                }
            };
            const fields = CopiesSummary.generateFields('en', ctx, [], {});
            expect(fields.isGaEnabled.value).to.deep.equal('false');
            done();
        });

        it('should propagate isWebChatEnabled from ctx into result', (done) => {
            const language = 'en';
            const ctx = {
                isGaEnabled: true,
                isWebchatEnabled: true,
            };
            const errors = [];
            const formdata = {};

            const result = CopiesSummary.generateFields(language, ctx, errors, formdata);

            expect(result).to.contain.keys('isWebchatEnabled');
            done();
        });
    });

    describe('isComplete()', () => {
        it('should return the completion status correctly', (done) => {
            const ctx = {
                passedPayment: true
            };
            const complete = CopiesSummary.isComplete(ctx);
            expect(complete).to.deep.equal([true, 'inProgress']);
            done();
        });
    });
});
