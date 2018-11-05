'use strict';

const initSteps = require('app/core/initSteps');
const chai = require('chai');
const expect = chai.expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('ApplicantName.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const applicantName = steps.ApplicantName;
            const url = applicantName.constructor.getUrl();
            expect(url).to.equal('/applicant-name');
            done();
        });
    });
});
