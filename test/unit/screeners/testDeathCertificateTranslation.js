'use strict';

const journey = require('app/journeys/probatenewdeathcertflow');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const coreContextMockData = require('../../data/core-context-mock-data.json');
const DeathCertificateTranslation = steps.DeathCertificateTranslation;

describe('DeathCertificateTranslation', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeathCertificateTranslation.constructor.getUrl();
            expect(url).to.equal('/death-certificate-translation');
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
                    deathCertificateTranslation: 'optionYes'
                }
            };
            const res = {};

            const ctx = DeathCertificateTranslation.getContextData(req, res);
            expect(ctx).to.deep.equal({
                ...coreContextMockData,
                sessionID: 'dummy_sessionId',
                deathCertificateTranslation: 'optionYes',
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
                            deathCertificateInEnglish: 'optionNo'
                        }
                    },
                    featureToggles: {
                        'ft_new_deathcert_flow': true
                    }
                }
            };
            const ctx = {
                deathCertificateTranslation: 'optionYes'
            };
            const nextStepUrl = DeathCertificateTranslation.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/deceased-domicile');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const req = {
                session: {
                    journey: journey,
                    form: {
                        screeners: {
                            deathCertificate: 'optionYes',
                            deathCertificateInEnglish: 'optionNo'
                        }
                    },
                    featureToggles: {
                        'ft_new_deathcert_flow': true
                    }
                }
            };
            const ctx = {
                deathCertificateTranslation: 'optionNo'
            };
            const nextStepUrl = DeathCertificateTranslation.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/deathCertificateTranslation');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = DeathCertificateTranslation.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'deathCertificateTranslation',
                    value: 'optionYes',
                    choice: 'hasDeathCertificateTranslation'
                }]
            });
            done();
        });
    });
});
