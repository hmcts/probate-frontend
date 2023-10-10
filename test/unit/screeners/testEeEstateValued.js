'use strict';

const journey = require('app/journeys/probate');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const coreContextMockData = require('../../data/core-context-mock-data.json');
const journeyProbate = require('../../../app/journeys/probate');
const ExceptedEstateValued = steps.ExceptedEstateValued;
const PreviousStep = steps.ExceptedEstateDeceasedDod;
describe('ExceptedEstateValued', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ExceptedEstateValued.constructor.getUrl();
            expect(url).to.equal('/ee-estate-valued');
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
                    eeEstateValued: 'optionYes'
                }
            };
            const res = {};

            const ctx = ExceptedEstateValued.getContextData(req, res);
            expect(ctx).to.deep.equal({
                ...coreContextMockData,
                sessionID: 'dummy_sessionId',
                eeEstateValued: 'optionYes'
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
                            eeDeceasedDod: 'optionYes'

                        }
                    },
                    featureToggles: {ft_excepted_estates: true}
                }
            };
            const ctx = {
                eeEstateValued: 'optionYes'
            };
            const nextStepUrl = ExceptedEstateValued.nextStepUrl(req, ctx);
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
                            deathCertificateInEnglish: 'optionNo',
                            deathCertificateTranslation: 'optionYes',
                            domicile: 'optionYes',
                            eeDeceasedDod: 'optionYes'
                        }
                    },
                    featureToggles: {ft_excepted_estates: true}
                }
            };
            const ctx = {
                eeEstateValued: 'optionNo'
            };
            const nextStepUrl = ExceptedEstateValued.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/eeEstateNotValued');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = ExceptedEstateValued.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'eeEstateValued',
                    value: 'optionYes',
                    choice: 'eeEstateValued'
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
                            eeDeceasedDod: 'optionYes'
                        }
                    },
                    caseType: 'gop'
                }
            };
            req.session.journey = journeyProbate;
            ctx = {};
            ExceptedEstateValued.previousScrennerStepUrl(req, res, ctx);
            expect(ctx.previousUrl).to.equal(PreviousStep.constructor.getUrl());
            done();
        });
    });
});
