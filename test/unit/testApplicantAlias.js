'use strict';

const initSteps = require('app/core/initSteps');
const chai = require('chai');
const expect = chai.expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('ApplicantAlias', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const ApplicantAlias = steps.ApplicantAlias;
            const url = ApplicantAlias.constructor.getUrl();
            expect(url).to.equal('/applicant-alias');
            done();
        });
    });

    describe('isComplete()', () => {
        it('should return the correct data when the feature toggle does not exist', (done) => {
            const ApplicantAlias = steps.ApplicantAlias;
            const ctx = {};
            const formdata = {};
            const featureToggles = {};
            const isComplete = ApplicantAlias.isComplete(ctx, formdata, featureToggles);
            expect(isComplete).to.deep.equal([true, 'noProgress']);
            done();
        });
    });
});
