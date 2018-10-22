const {expect} = require('chai');
const initSteps = require('app/core/initSteps');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('TermConditions unit tests', () => {

    describe('getUrl()', () => {
        it('should return correct url', (done) => {
            const contactUs = steps.ContactUs;
            const url = contactUs.constructor.getUrl();
            expect(url).to.equal('/contact-us');
            done();
        });
    });
});
