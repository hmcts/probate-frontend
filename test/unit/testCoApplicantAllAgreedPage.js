'use strict';

const initSteps = require('app/core/initSteps');
const chai = require('chai');
const expect = chai.expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('CoApplicantAllAgreedPage.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const coApplicantAllAgreedPage = steps.CoApplicantAllAgreedPage;
            const url = coApplicantAllAgreedPage.constructor.getUrl();
            expect(url).to.equal('/co-applicant-all-agreed-page');
            done();
        });
    });
});
