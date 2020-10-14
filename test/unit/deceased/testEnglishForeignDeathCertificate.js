'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const EnglishForeignDeathCert = steps.EnglishForeignDeathCert;

describe('EnglishForeignDeathCert', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = EnglishForeignDeathCert.constructor.getUrl();
            expect(url).to.equal('/english-foreign-death-cert');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct next step options', (done) => {
            const result = EnglishForeignDeathCert.nextStepOptions();
            expect(result).to.deep.equal({
                options: [{
                    key: 'englishForeignDeathCert',
                    value: 'optionYes',
                    choice: 'foreignDeathCertIsInEnglish'
                }]
            });
            done();
        });
    });

    describe('action()', () => {
        it('removes the foreignDeathCertTranslation value from the context when there is an english foreign death cert', (done) => {
            let formdata = {};
            let ctx = {
                englishForeignDeathCert: 'optionYes',
                foreignDeathCertTranslation: 'optionNo'
            };
            [ctx, formdata] = EnglishForeignDeathCert.action(ctx, formdata);
            expect(ctx).to.deep.equal({
                englishForeignDeathCert: 'optionYes',
                foreignDeathCertTranslation: {}
            });
            done();
        });
    });
});
