const {expect} = require('chai');
const initSteps = require('app/core/initSteps');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('Cookies unit tests', () => {

    describe('getUrl()', () => {
        it('should return correct url', (done) => {
            const cookies = steps.Cookies;
            const url = cookies.constructor.getUrl();
            expect(url).to.equal('/cookies');
            done();
        });
    });
});
