'use strict';

const content = require('app/resources/en/translation/applicant/executor');
const initSteps = require('app/core/initSteps');
const chai = require('chai');
const expect = chai.expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const ApplicantExecutor = steps.ApplicantExecutor;

describe('ApplicantExecutor.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantExecutor.constructor.getUrl();
            expect(url).to.equal('/applicant-executor');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when Yes is given', (done) => {
            const ctx = {executor: 'Yes'};
            const nextStepUrl = ApplicantExecutor.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/mental-capacity');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const ctx = {executor: 'No'};
            const nextStepUrl = ApplicantExecutor.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/stop-page/notExecutor');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = ApplicantExecutor.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'executor',
                    value: content.optionYes,
                    choice: 'isExecutor'
                }]
            });
            done();
        });
    });
});
