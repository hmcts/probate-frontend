'use strict';

const content = require('app/resources/en/translation/deceased/domicile');
const initSteps = require('app/core/initSteps');
const chai = require('chai');
const expect = chai.expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const DeceasedDomicile = steps.DeceasedDomicile;

describe('DeceasedDomicile.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedDomicile.constructor.getUrl();
            expect(url).to.equal('/deceased-domicile');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when Yes is given', (done) => {
            const ctx = {domicile: 'Yes'};
            const nextStepUrl = DeceasedDomicile.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/iht-completed');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const ctx = {domicile: 'No'};
            const nextStepUrl = DeceasedDomicile.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/stop-page/notInEnglandOrWales');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = DeceasedDomicile.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'domicile',
                    value: content.optionYes,
                    choice: 'inEnglandOrWales'
                }]
            });
            done();
        });
    });
});
