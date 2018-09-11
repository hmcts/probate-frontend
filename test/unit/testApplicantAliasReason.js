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
});
