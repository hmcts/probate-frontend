'use strict';

const content = require('app/resources/en/translation/will/original');
const initSteps = require('app/core/initSteps');
const chai = require('chai');
const expect = chai.expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const WillOriginal = steps.WillOriginal;

describe('WillOriginal.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = WillOriginal.constructor.getUrl();
            expect(url).to.equal('/will-original');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when Yes is given', (done) => {
            const ctx = {original: 'Yes'};
            const nextStepUrl = WillOriginal.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/applicant-executor');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const ctx = {original: 'No'};
            const nextStepUrl = WillOriginal.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/stop-page/notOriginal');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = WillOriginal.nextStepOptions();
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
