'use strict';

const journey = require('app/journeys/probate');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const coreContextMockData = require('../../data/core-context-mock-data.json');
const IhtCompleted = steps.IhtCompleted;

describe('IhtCompleted', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = IhtCompleted.constructor.getUrl();
            expect(url).to.equal('/iht-completed');
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
                    completed: 'optionYes'
                }
            };
            const res = {};

            const ctx = IhtCompleted.getContextData(req, res);
            expect(ctx).to.deep.equal({
                ...coreContextMockData,
                sessionID: 'dummy_sessionId',
                completed: 'optionYes'
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
                            deathCertificateInEnglish: 'optionYes',
                            domicile: 'optionYes'
                        }
                    }
                }
            };
            const ctx = {
                completed: 'optionYes'
            };
            const nextStepUrl = IhtCompleted.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/will-left');
            done();
        });

        it('should return the correct url when Yes is given and EE FT ON', (done) => {
            const req = {
                session: {
                    journey: journey,
                    form: {
                        screeners: {
                            deathCertificate: 'optionYes',
                            deathCertificateInEnglish: 'optionYes',
                            domicile: 'optionYes',
                            eeDeceasedDod: 'optionNo'
                        }
                    },
                    featureToggles: {ft_excepted_estates: true}
                }
            };
            const ctx = {
                completed: 'optionYes'
            };
            const nextStepUrl = IhtCompleted.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/will-left');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const req = {
                session: {
                    journey: journey,
                    form: {
                        screeners: {
                            deathCertificate: 'optionYes',
                            deathCertificateInEnglish: 'optionYes',
                            domicile: 'optionYes'
                        }
                    }
                }
            };
            const ctx = {
                completed: 'optionNo'
            };
            const nextStepUrl = IhtCompleted.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/ihtNotCompleted');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = IhtCompleted.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'completed',
                    value: 'optionYes',
                    choice: 'completed'
                }]
            });
            done();
        });
    });
});
