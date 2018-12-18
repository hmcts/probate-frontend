'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const content = require('app/resources/en/translation/will/newleft');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const NewWillLeft = steps.NewWillLeft;

describe('NewWillLeft', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = NewWillLeft.constructor.getUrl();
            expect(url).to.equal('/new-will-left');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when Yes is given', (done) => {
            const ctx = {left: content.optionYes};
            const nextStepUrl = NewWillLeft.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/new-will-original');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const ctx = {left: content.optionNo};
            const nextStepUrl = NewWillLeft.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/stop-page/noWill');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = NewWillLeft.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'left',
                    value: content.optionYes,
                    choice: 'withWill'
                }]
            });
            done();
        });
    });
});
