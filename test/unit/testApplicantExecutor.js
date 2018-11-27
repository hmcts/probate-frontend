'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const journey = require('app/journeys/probate');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('ApplicantExecutor', () => {
    describe('nextStepUrl()', () => {
        it('should return url for the next step', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                executor: 'Yes'
            };
            const ApplicantExecutor = steps.ApplicantExecutor;
            const nextStepUrl = ApplicantExecutor.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/mental-capacity');
            done();
        });

        it('should return the url for the stop page', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {};
            const ApplicantExecutor = steps.ApplicantExecutor;
            const nextStepUrl = ApplicantExecutor.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/notExecutor');
            done();
        });
    });
});
