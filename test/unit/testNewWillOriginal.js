'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const content = require('app/resources/en/translation/will/neworiginal');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const NewWillOriginal = steps.NewWillOriginal;

describe('NewWillOriginal', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = NewWillOriginal.constructor.getUrl();
            expect(url).to.equal('/new-will-original');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when Yes is given', (done) => {
            const ctx = {original: content.optionYes};
            const nextStepUrl = NewWillOriginal.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/new-applicant-executor');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const ctx = {original: content.optionNo};
            const nextStepUrl = NewWillOriginal.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/stop-page/notOriginal');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = NewWillOriginal.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'original',
                    value: content.optionYes,
                    choice: 'isOriginal'
                }]
            });
            done();
        });
    });
});
