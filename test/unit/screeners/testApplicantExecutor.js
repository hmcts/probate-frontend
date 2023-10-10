'use strict';

const journey = require('app/journeys/probate');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ApplicantExecutor = steps.ApplicantExecutor;
const coreContextMockData = require('../../data/core-context-mock-data.json');
const journeyProbate = require('../../../app/journeys/probate');
const PreviousStep = steps.WillOriginal;
describe('ApplicantExecutor', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantExecutor.constructor.getUrl();
            expect(url).to.equal('/applicant-executor');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the correct context on GET', (done) => {
            const req = {
                method: 'GET',
                sessionID: 'dummy_sessionId',
                session: {
                    language: 'en',
                    form: {
                        ccdCase: {
                            id: 1234567890123456,
                            state: 'Pending'
                        }
                    },
                    caseType: 'gop'
                },
                body: {
                    executor: 'optionYes'
                }
            };
            const res = {};

            const ctx = ApplicantExecutor.getContextData(req, res);
            expect(ctx).to.deep.equal({
                ...coreContextMockData,
                sessionID: 'dummy_sessionId',
                executor: 'optionYes',
            });
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when Yes is given', (done) => {
            const req = {
                session: {
                    journey: journey,
                    form: {
                        screeners: {
                            deathCertificate: 'optionYes',
                            deathCertificateInEnglish: 'optionNo',
                            deathCertificateTranslation: 'optionYes',
                            domicile: 'optionYes',
                            completed: 'optionYes',
                            left: 'optionYes',
                            original: 'optionYes'
                        }
                    }
                }
            };
            const ctx = {
                executor: 'optionYes'
            };
            const nextStepUrl = ApplicantExecutor.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/mental-capacity');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const req = {
                session: {
                    journey: journey,
                    form: {
                        screeners: {
                            deathCertificate: 'optionYes',
                            deathCertificateInEnglish: 'optionNo',
                            deathCertificateTranslation: 'optionYes',
                            domicile: 'optionYes',
                            completed: 'optionYes',
                            left: 'optionYes',
                            original: 'optionYes'
                        }
                    }
                }
            };
            const ctx = {
                executor: 'optionNo'
            };
            const nextStepUrl = ApplicantExecutor.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/notExecutor');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = ApplicantExecutor.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'executor',
                    value: 'optionYes',
                    choice: 'isExecutor'
                }]
            });
            done();
        });
    });
    describe('previousScrennerStepUrl()', () => {
        let ctx;
        it('should return the previous step url', (done) => {
            const res = {
                redirect: (url) => url
            };
            const req = {
                method: 'GET',
                session: {
                    language: 'en',
                    form: {
                        screeners: {
                            deathCertificate: 'optionYes',
                            deathCertificateInEnglish: 'optionYes',
                            domicile: 'optionYes',
                            eeDeceasedDod: 'optionYes',
                            eeEstateValued: 'optionYes',
                            completed: 'optionYes',
                            left: 'optionYes',
                            original: 'optionYes'
                        }
                    },
                    caseType: 'gop'
                }
            };
            req.session.journey = journeyProbate;
            ctx = {};
            ApplicantExecutor.previousScrennerStepUrl(req, res, ctx);
            expect(ctx.previousUrl).to.equal(PreviousStep.constructor.getUrl());
            done();
        });
    });
});
