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
            const ctx = {
                isStopIHTOnline: true,
                checkData: false,
                iht: {
                    method: 'optionOnline'
                }
            };
            const result = EnglishForeignDeathCert.nextStepOptions(ctx);
            expect(result).to.deep.equal({
                options: [{
                    key: 'englishForeignDeathCert',
                    value: 'optionYes',
                    choice: 'foreignDeathCertIsInEnglish'
                }]
            });
            done();
        });

        it('should return the correct next step options for IHT Paper', (done) => {
            const ctx = {
                isStopIHTOnline: true,
                checkData: true,
                iht: {
                    method: 'optionPaper'
                }
            };
            const result = EnglishForeignDeathCert.nextStepOptions(ctx);
            expect(result).to.deep.equal({
                options: [{
                    key: 'englishForeignDeathCert',
                    value: 'optionYes',
                    choice: 'ihtPaper'
                }]
            });
            done();
        });
    });
});
