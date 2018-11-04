const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;

describe('NewStartEligibility', () => {

    const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
    const newStartEligibility = steps.NewStartEligibility;

    describe('getUrl()', () => {
        it('test correct url is returned from getUrl function', () => {
            assert.equal(newStartEligibility.constructor.getUrl(), '/new-start-eligibility');
        });
    });
});
