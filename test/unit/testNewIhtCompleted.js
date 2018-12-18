'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const content = require('app/resources/en/translation/iht/newcompleted');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const NewIhtCompleted = steps.NewIhtCompleted;

describe('NewIhtCompleted', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = NewIhtCompleted.constructor.getUrl();
            expect(url).to.equal('/new-iht-completed');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when Yes is given', (done) => {
            const ctx = {completed: content.optionYes};
            const nextStepUrl = NewIhtCompleted.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/new-will-left');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const ctx = {completed: content.optionNo};
            const nextStepUrl = NewIhtCompleted.nextStepUrl(ctx);
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
