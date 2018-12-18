'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const content = require('app/resources/en/translation/applicant/newexecutor');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const NewApplicantExecutor = steps.NewApplicantExecutor;

describe('NewApplicantExecutor', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = NewApplicantExecutor.constructor.getUrl();
            expect(url).to.equal('/new-applicant-executor');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when Yes is given', (done) => {
            const ctx = {executor: content.optionYes};
            const nextStepUrl = NewApplicantExecutor.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/new-mental-capacity');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const ctx = {executor: content.optionNo};
            const nextStepUrl = NewApplicantExecutor.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/stop-page/notExecutor');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = NewApplicantExecutor.nextStepOptions();
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
