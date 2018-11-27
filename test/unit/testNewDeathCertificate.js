'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const journey = require('app/journeys/probate');
const content = require('app/resources/en/translation/deceased/newdeathcertificate');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const NewDeathCertificate = steps.NewDeathCertificate;

describe('NewDeathCertificate', () => {
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
            const NewDeathCertificate = steps.NewDeathCertificate;
            const nextStepUrl = NewDeathCertificate.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/new-deceased-domicile');
            done();
        });

        it('should return the url for the stop page', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                deathCertificate: 'No'
            };
            const NewDeathCertificate = steps.NewDeathCertificate;
            const nextStepUrl = NewDeathCertificate.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/deathCertificate');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = NewDeathCertificate.nextStepOptions();
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
