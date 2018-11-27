'use strict';

const content = require('app/resources/en/translation/executors/mentalcapacity');
const initSteps = require('app/core/initSteps');
const chai = require('chai');
const expect = chai.expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const MentalCapacity = steps.MentalCapacity;
const journey = require('app/journeys/probate');

describe('MentalCapacity.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = MentalCapacity.constructor.getUrl();
            expect(url).to.equal('/mental-capacity');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        const req = {
            session: {
                journey: journey
            }
        };

        it('should return the correct url when Yes is given', (done) => {
            const ctx = {mentalCapacity: 'Yes'};
            const nextStepUrl = MentalCapacity.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/tasklist');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const ctx = {mentalCapacity: 'No'};
            const nextStepUrl = MentalCapacity.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/mentalCapacity');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = MentalCapacity.nextStepOptions();
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

    describe('isComplete()', () => {
        it('should return the correct values when the step is complete', (done) => {
            const ctx = {mentalCapacity: 'Yes'};
            const val = MentalCapacity.isComplete(ctx);
            expect(val).to.deep.equal([true, 'inProgress']);
            done();
        });

        it('should return the correct values when the step is not complete', (done) => {
            const ctx = {mentalCapacity: 'No'};
            const val = MentalCapacity.isComplete(ctx);
            expect(val).to.deep.equal([false, 'inProgress']);
            done();
        });
    });
});
