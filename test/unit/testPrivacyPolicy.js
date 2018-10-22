const {expect} = require('chai');
const initSteps = require('app/core/initSteps');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('PrivacyPolicy unit tests', () => {

    describe('getUrl()', () => {
        it('should return correct url', (done) => {
            const privacyPolicy = steps.PrivacyPolicy;
            const url = privacyPolicy.constructor.getUrl();
            expect(url).to.equal('/privacy-policy');
            done();
        });
    });
});
