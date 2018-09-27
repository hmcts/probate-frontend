'use strict';
const initSteps = require('app/core/initSteps');
const chai = require('chai');
const expect = chai.expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('ApplicantAliasReason', () => {
    const ApplicantAliasReason = steps.ApplicantAliasReason;

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantAliasReason.constructor.getUrl();
            expect(url).to.equal('/applicant-alias-reason');
            done();
        });
    });

    describe('isComplete()', () => {
        describe('should return the correct data when the feature toggle exists', () => {
            it('and is enabled and the field value exists', (done) => {
                const ApplicantAliasReason = steps.ApplicantAliasReason;
                const ctx = {aliasReason: 'Divorce'};
                const formdata = {};
                const featureToggles = {main_applicant_alias: true};
                const isComplete = ApplicantAliasReason.isComplete(ctx, formdata, featureToggles);
                expect(isComplete).to.deep.equal([true, 'inProgress']);
                done();
            });

            it('and is disabled', (done) => {
                const ApplicantAliasReason = steps.ApplicantAliasReason;
                const ctx = {};
                const formdata = {};
                const featureToggles = {main_applicant_alias: false};
                const isComplete = ApplicantAliasReason.isComplete(ctx, formdata, featureToggles);
                expect(isComplete).to.deep.equal([true, 'inProgress']);
                done();
            });
        });

        it('should return the correct data when the feature toggle does not exist', (done) => {
            const ApplicantAliasReason = steps.ApplicantAliasReason;
            const ctx = {};
            const formdata = {};
            const featureToggles = {};
            const isComplete = ApplicantAliasReason.isComplete(ctx, formdata, featureToggles);
            expect(isComplete).to.deep.equal([true, 'inProgress']);
            done();
        });
    });
});
