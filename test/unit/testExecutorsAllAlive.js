'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const journey = require('app/journeys/probate');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('ExecutorsAllAlive', () => {
    describe('nextStepUrl()', () => {
        it('should return url for the next step if all the excutors are alive', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                allalive: 'Yes'
            };
            const ExecutorsAllAlive = steps.ExecutorsAllAlive;
            const nextStepUrl = ExecutorsAllAlive.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/other-executors-applying');
            done();
        });

        it('should return url for the next step if all the executors are not alive', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                allalive: 'No'
            };
            const ExecutorsAllAlive = steps.ExecutorsAllAlive;
            const nextStepUrl = ExecutorsAllAlive.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/executors-who-died');
            done();
        });
    });
});
