'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const journey = require('app/journeys/probate');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('IhtCompleted', () => {
    describe('nextStepUrl()', () => {
        it('should return url for the next step', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                completed: 'Yes'
            };
            const IhtCompleted = steps.IhtCompleted;
            const nextStepUrl = IhtCompleted.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/iht-method');
            done();
        });

        it('should return the url for the stop page', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {};
            const IhtCompleted = steps.IhtCompleted;
            const nextStepUrl = IhtCompleted.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/ihtNotCompleted');
            done();
        });
    });
});
