'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const journey = require('app/journeys/probate');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('DeathCertificate', () => {
    describe('nextStepUrl()', () => {
        it('should return url for the next step', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                deathCertificate: 'Yes'
            };
            const DeathCertificate = steps.DeathCertificate;
            const nextStepUrl = DeathCertificate.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/iht-completed');
            done();
        });

        it('should return the url for the stop page', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {};
            const DeathCertificate = steps.DeathCertificate;
            const nextStepUrl = DeathCertificate.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/deathCertificate');
            done();
        });
    });
});
