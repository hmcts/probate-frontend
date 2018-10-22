const {expect} = require('chai');
const initSteps = require('app/core/initSteps');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('PinResend unit tests', () => {

    describe('getUrl()', () => {
        it('should return correct url', (done) => {
            const pinResend = steps.PinResend;
            const url = pinResend.constructor.getUrl();
            expect(url).to.equal('/pin-resend');
            done();
        });
    });
});
