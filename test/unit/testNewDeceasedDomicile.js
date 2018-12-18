'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const content = require('app/resources/en/translation/deceased/newdomicile');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const NewDeceasedDomicile = steps.NewDeceasedDomicile;

describe('NewDeceasedDomicile', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = NewDeceasedDomicile.constructor.getUrl();
            expect(url).to.equal('/new-deceased-domicile');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when Yes is given', (done) => {
            const ctx = {domicile: content.optionYes};
            const nextStepUrl = NewDeceasedDomicile.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/new-iht-completed');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const ctx = {domicile: content.optionNo};
            const nextStepUrl = NewDeceasedDomicile.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/stop-page/notInEnglandOrWales');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = NewDeceasedDomicile.nextStepOptions();
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
