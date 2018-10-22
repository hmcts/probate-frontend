const {expect} = require('chai');
const initSteps = require('app/core/initSteps');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('PinPage unit tests', () => {

    describe('getUrl()', () => {
        it('should return correct url', (done) => {
            const pinPage = steps.PinPage;
            const url = pinPage.constructor.getUrl();
            expect(url).to.equal('/sign-in');
            done();
        });
    });
});
