'use strict';

const journey = require('app/journeys/probate');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DeathCertificate = steps.DeathCertificate;
const content = require('app/resources/en/translation/screeners/deathcertificate');

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
                    form: {},
                    journeyType: 'Probate'
                },
                body: {
                    deathCertificate: content.optionYes
                }
            };
            const res = {};

            const ctx = DeathCertificate.getContextData(req, res);
            expect(ctx).to.deep.equal({
                sessionID: 'dummy_sessionId',
                deathCertificate: content.optionYes,
                journeyType: 'Probate'
            });
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when Yes is given', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                deathCertificate: content.optionYes
            };
            const nextStepUrl = DeathCertificate.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/deceased-domicile');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                deathCertificate: content.optionNo
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
                    value: content.optionYes,
                    choice: 'hasCertificate'
                }]
            });
            done();
        });
    });
});
