const {expect} = require('chai');
const initSteps = require('app/core/initSteps');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('PinSent unit tests', () => {

    describe('getUrl()', () => {
        it('should return correct url', (done) => {
            const pinSent = steps.PinSent;
            const url = pinSent.constructor.getUrl();
            expect(url).to.equal('/pin-sent');
            done();
        });
    });
});
