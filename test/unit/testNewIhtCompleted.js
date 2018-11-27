'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const journey = require('app/journeys/probate');
const content = require('app/resources/en/translation/iht/newcompleted');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const NewIhtCompleted = steps.NewIhtCompleted;

describe('NewIhtCompleted', () => {
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
            const NewIhtCompleted = steps.NewIhtCompleted;
            const nextStepUrl = NewIhtCompleted.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/new-will-left');
            done();
        });

        it('should return the url for the stop page', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                completed: 'No'
            };
            const NewIhtCompleted = steps.NewIhtCompleted;
            const nextStepUrl = NewIhtCompleted.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/ihtNotCompleted');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = NewIhtCompleted.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'completed',
                    value: content.optionYes,
                    choice: 'completed'
                }]
            });
            done();
        });
    });
});
