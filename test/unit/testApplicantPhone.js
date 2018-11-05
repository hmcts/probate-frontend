'use strict';

const initSteps = require('app/core/initSteps');
const chai = require('chai');
const expect = chai.expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('ApplicantPhone.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const applicantPhone = steps.ApplicantPhone;
            const url = applicantPhone.constructor.getUrl();
            expect(url).to.equal('/applicant-phone');
            done();
        });
    });
});
