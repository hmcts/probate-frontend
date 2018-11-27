'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const journey = require('app/journeys/probate');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('NewApplicantExecutor', () => {
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
            const NewApplicantExecutor = steps.NewApplicantExecutor;
            const nextStepUrl = NewApplicantExecutor.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/new-mental-capacity');
            done();
        });

        it('should return the url for the stop page', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {};
            const NewApplicantExecutor = steps.NewApplicantExecutor;
            const nextStepUrl = NewApplicantExecutor.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/notExecutor');
            done();
        });
    });
});
