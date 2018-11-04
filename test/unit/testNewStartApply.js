const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;

describe('NewStartApply', () => {

    const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
    const newStartApply = steps.NewStartApply;

    it('test correct url is returned from getUrl function', () => {
        assert.equal(newStartApply.constructor.getUrl(), '/new-start-apply');
    });
});
