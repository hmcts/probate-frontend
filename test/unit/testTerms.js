const {expect} = require('chai');
const initSteps = require('app/core/initSteps');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('TermConditions unit tests', () => {

    describe('getUrl()', () => {
        it('should return correct url', (done) => {
            const termsConditions = steps.TermsConditions;
            const url = termsConditions.constructor.getUrl();
            expect(url).to.equal('/terms-conditions');
            done();
        });
    });
});
