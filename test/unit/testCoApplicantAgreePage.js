const {expect} = require('chai');
const initSteps = require('app/core/initSteps');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('CoApplicantAgreePage unit tests', () => {

    describe('getUrl()', () => {
        it('should return correct url', (done) => {
            const coApplicantAgreePage = steps.CoApplicantAgreePage;
            const url = coApplicantAgreePage.constructor.getUrl();
            expect(url).to.equal('/co-applicant-agree-page');
            done();
        });
    });
});
