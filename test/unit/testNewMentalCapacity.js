'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const content = require('app/resources/en/translation/executors/newmentalcapacity');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const NewMentalCapacity = steps.NewMentalCapacity;

describe('NewMentalCapacity', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = NewMentalCapacity.constructor.getUrl();
            expect(url).to.equal('/new-mental-capacity');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when Yes is given', (done) => {
            const ctx = {mentalCapacity: content.optionYes};
            const nextStepUrl = NewMentalCapacity.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/new-start-apply');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const ctx = {mentalCapacity: content.optionNo};
            const nextStepUrl = NewMentalCapacity.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/stop-page/mentalCapacity');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = NewMentalCapacity.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'mentalCapacity',
                    value: content.optionYes,
                    choice: 'isCapable'
                }]
            });
            done();
        });
    });
});
