'use strict';

const json = require('app/resources/en/translation/applicant/executor');
const initSteps = require('app/core/initSteps');
const chai = require('chai');
const expect = chai.expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('ApplicantExecutor.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const applicantExecutor = steps.ApplicantExecutor;
            const url = applicantExecutor.constructor.getUrl();
            expect(url).to.equal('/applicant-executor');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when Yes is given', (done) => {
            const ctx = {executor: 'Yes'};
            const applicantExecutor = steps.ApplicantExecutor;
            const nextStepUrl = applicantExecutor.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/mental-capacity');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const ctx = {executor: 'No'};
            const applicantExecutor = steps.ApplicantExecutor;
            const nextStepUrl = applicantExecutor.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/stop-page/notExecutor');
            done();
        });
    });

    describe('handlePost()', () => {
        const testErrors = [];

        it('should return the correct stopReason when Yes is given', (done) => {
            const testCtx = {executor: 'Yes', stopReason: ''};
            const applicantExecutor = steps.ApplicantExecutor;
            const handlePost = applicantExecutor.handlePost(testCtx, testErrors);
            expect(handlePost[0].stopReason).to.equal('');
            done();
        });

        it('should return the correct stopReason when No is given', (done) => {
            const testCtx = {executor: 'No', stopReason: ''};
            const applicantExecutor = steps.ApplicantExecutor;
            const handlePost = applicantExecutor.handlePost(testCtx, testErrors);
            expect(handlePost[0].stopReason).to.equal('notExecutor');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const applicantExecutor = steps.ApplicantExecutor;
            const nextStepOptions = applicantExecutor.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'executor',
                    value: json.optionYes,
                    choice: 'isExecutor'
                }]
            });
            done();
        });
    });
});
