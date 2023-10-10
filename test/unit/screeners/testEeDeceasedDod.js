'use strict';

const journey = require('app/journeys/probate');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const coreContextMockData = require('../../data/core-context-mock-data.json');
const journeyProbate = require('../../../app/journeys/probate');
const ExceptedEstateDeceasedDod = steps.ExceptedEstateDeceasedDod;
const PreviousStep = steps.DeceasedDomicile;
describe('ExceptedEstateDeceasedDod', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ExceptedEstateDeceasedDod.constructor.getUrl();
            expect(url).to.equal('/ee-deceased-dod');
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
                    eeDeceasedDod: 'optionYes'
                }
            };
            const res = {};

            const ctx = ExceptedEstateDeceasedDod.getContextData(req, res);
            expect(ctx).to.deep.equal({
                ...coreContextMockData,
                sessionID: 'dummy_sessionId',
                eeDeceasedDod: 'optionYes'
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
                            domicile: 'optionYes'
                        }
                    },
                    featureToggles: {ft_excepted_estates: true}
                }
            };
            const ctx = {
                eeDeceasedDod: 'optionYes'
            };
            const nextStepUrl = ExceptedEstateDeceasedDod.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/ee-estate-valued');
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
                            domicile: 'optionYes'
                        }
                    },
                    featureToggles: {ft_excepted_estates: true}
                }
            };
            const ctx = {
                eeDeceasedDod: 'optionNo'
            };
            const nextStepUrl = ExceptedEstateDeceasedDod.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/iht-completed');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = ExceptedEstateDeceasedDod.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'eeDeceasedDod',
                    value: 'optionYes',
                    choice: 'dodAfterEeThreshold'
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
                            domicile: 'optionYes'
                        }
                    },
                    caseType: 'gop'
                }
            };
            req.session.journey = journeyProbate;
            ctx = {};
            ExceptedEstateDeceasedDod.previousScrennerStepUrl(req, res, ctx);
            expect(ctx.previousUrl).to.equal(PreviousStep.constructor.getUrl());
            done();
        });

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
                            deathCertificateInEnglish: 'optionNo',
                            deathCertificateTranslation: 'optionYes',
                            domicile: 'optionYes'
                        }
                    },
                    caseType: 'gop'
                }
            };
            req.session.journey = journeyProbate;
            ctx = {};
            ExceptedEstateDeceasedDod.previousScrennerStepUrl(req, res, ctx);
            expect(ctx.previousUrl).to.equal(PreviousStep.constructor.getUrl());
            done();
        });
    });
});
