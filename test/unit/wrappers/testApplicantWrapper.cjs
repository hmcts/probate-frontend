'use strict';

const ApplicantWrapper = require('app/wrappers/Applicant.cjs');
const expect = require('chai').expect;

describe('Applicant.js', () => {
    describe('applicantHasDeclared()', () => {
        it('should return true if the applicant has declared', (done) => {
            const data = {declaration: {declarationCheckbox: 'true'}};
            const applicantWrapper = new ApplicantWrapper(data);
            expect(applicantWrapper.applicantHasDeclared()).to.equal(true);
            done();
        });

        it('should return false if the applicant has not yet declared', (done) => {
            const data = {};
            const applicantWrapper = new ApplicantWrapper(data);
            expect(applicantWrapper.applicantHasDeclared()).to.equal(false);
            done();
        });
    });
});
