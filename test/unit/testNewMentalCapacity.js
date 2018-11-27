'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const content = require('app/resources/en/translation/executors/newmentalcapacity');
const journey = require('app/journeys/probate');
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
        it('should return url for the next step', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                mentalCapacity: 'Yes'
            };
            const NewMentalCapacity = steps.NewMentalCapacity;
            const nextStepUrl = NewMentalCapacity.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/new-start-apply');
            done();
        });

        it('should return the url for the stop page', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                mentalCapacity: 'No'
            };
            const NewMentalCapacity = steps.NewMentalCapacity;
            const nextStepUrl = NewMentalCapacity.nextStepUrl(req, ctx);
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
