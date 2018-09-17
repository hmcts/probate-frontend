'use strict';
const initSteps = require('app/core/initSteps');
const chai = require('chai');
const expect = chai.expect;
const content = require('app/resources/en/translation/applicant/nameasonwill');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const ApplicantNameAsOnWill = steps.ApplicantNameAsOnWill;

describe('ApplicantNameAsOnWill', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantNameAsOnWill.constructor.getUrl();
            expect(url).to.equal('/applicant-name-as-on-will');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct next step options', (done) => {
            const result = ApplicantNameAsOnWill.nextStepOptions();
            expect(result).to.deep.equal({
                options: [{
                    key: 'nameAsOnTheWill',
                    value: content.optionNo,
                    choice: 'hasAlias'
                }]
            });
            done();
        });
    });
});
