const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const startApply = steps.StartApply;

describe('StartApply', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = startApply.constructor.getUrl();
            expect(url).to.equal('/start-apply*');
            done();
        });
    });
});
