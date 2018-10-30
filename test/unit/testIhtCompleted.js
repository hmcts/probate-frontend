'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const IhtCompleted = steps.IhtCompleted;

describe('IhtCompleted', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = IhtCompleted.constructor.getUrl();
            expect(url).to.equal('/iht-completed');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return correct next step url', (done) => {
            const url = IhtCompleted.nextStepUrl({});
            expect(url).to.include('ihtNotCompleted');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return correct next step url', (done) => {
            const nextStep = IhtCompleted.nextStepOptions({});
            expect(nextStep).to.deep.equal({options: [{key: 'completed', value: 'Yes', choice: 'completed'}]});
            done();
        });
    });

});
