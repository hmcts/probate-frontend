'use strict';

const journey = require('app/journeys/probate');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const coreContextMockData = require('../../data/core-context-mock-data.json');
const DeathCertificateInEnglish = steps.DeathCertificateInEnglish;

describe('DeathCertificateInEnglish', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeathCertificateInEnglish.constructor.getUrl();
            expect(url).to.equal('/death-certificate-english*');
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
                    deathCertificateInEnglish: 'optionYes'
                }
            };
            const res = {};

            const ctx = DeathCertificateInEnglish.getContextData(req, res);
            expect(ctx).to.deep.equal({
                ...coreContextMockData,
                sessionID: 'dummy_sessionId',
                deathCertificateInEnglish: 'optionYes',
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
                            deathCertificate: 'optionYes'
                        }
                    },
                    featureToggles: {
                        'ft_new_deathcert_flow': true
                    }
                }
            };
            const ctx = {
                deathCertificateInEnglish: 'optionYes'
            };
            const nextStepUrl = DeathCertificateInEnglish.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/deceased-domicile');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const req = {
                session: {
                    journey: journey,
                    form: {
                        screeners: {
                            deathCertificate: 'optionYes'
                        }
                    },
                    featureToggles: {
                        'ft_new_deathcert_flow': true
                    }
                }
            };
            const ctx = {
                deathCertificateInEnglish: 'optionNo'
            };
            const nextStepUrl = DeathCertificateInEnglish.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/death-certificate-translation');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = DeathCertificateInEnglish.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'deathCertificateInEnglish',
                    value: 'optionYes',
                    choice: 'deathCertificateInEnglish'
                }]
            });
            done();
        });
    });
});
