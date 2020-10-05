'use strict';

const probateJourney = require('app/journeys/probate');
const probateNewDeathCertJourney = require('app/journeys/probatenewdeathcertflow');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DeathCertificate = steps.DeathCertificate;

describe('DeathCertificate', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeathCertificate.constructor.getUrl();
            expect(url).to.equal('/death-certificate');
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
                    deathCertificate: 'optionYes'
                }
            };
            const res = {};

            const ctx = DeathCertificate.getContextData(req, res);
            expect(ctx).to.deep.equal({
                sessionID: 'dummy_sessionId',
                deathCertificate: 'optionYes',
                caseType: 'gop',
                userLoggedIn: false,
                ccdCase: {
                    id: 1234567890123456,
                    state: 'Pending'
                },
                language: 'en'
            });
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when Yes is given', (done) => {
            const req = {
                session: {
                    journey: probateJourney
                }
            };
            const ctx = {
                deathCertificate: 'optionYes'
            };
            const nextStepUrl = DeathCertificate.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/deceased-domicile');
            done();
        });

        //DTSPB-529 Test duplicated for new probate death cert flow.
        it('should return the correct url when Yes is given', (done) => {
            const req = {
                session: {
                    journey: probateNewDeathCertJourney
                },
                featureToggles: {
                    'ft_new_deathcert_flow': true
                }
            };
            const ctx = {
                deathCertificate: 'optionYes'
            };
            const nextStepUrl = DeathCertificate.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/death-certificate-english');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const req = {
                session: {
                    journey: probateJourney
                }
            };
            const ctx = {
                deathCertificate: 'optionNo'
            };
            const nextStepUrl = DeathCertificate.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/deathCertificate');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = DeathCertificate.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'deathCertificate',
                    value: 'optionYes',
                    choice: 'hasCertificate'
                }]
            });
            done();
        });
    });
});
