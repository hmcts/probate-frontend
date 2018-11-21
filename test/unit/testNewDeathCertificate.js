'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const NewDeathCertificate = steps.NewDeathCertificate;
const content = require('app/resources/en/translation/deceased/newdeathcertificate');

describe('NewDeathCertificate', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = NewDeathCertificate.constructor.getUrl();
            expect(url).to.equal('/new-death-certificate');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when Yes is given', (done) => {
            const ctx = {deathCertificate: content.optionYes};
            const nextStepUrl = NewDeathCertificate.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/new-deceased-domicile');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const ctx = {deathCertificate: content.optionNo};
            const nextStepUrl = NewDeathCertificate.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/stop-page/deathCertificate');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = NewDeathCertificate.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'deathCertificate',
                    value: content.optionYes,
                    choice: 'hasCertificate'
                }]
            });
            done();
        });
    });
});
