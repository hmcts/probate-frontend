const initSteps = require('app/core/initSteps');
const {assert, expect} = require('chai');

describe('WillOriginal', () => {

    const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
    const WillOriginal = steps.WillOriginal;

    describe('getUrl()', () => {
        it('test correct url is returned from getUrl function', (done) => {
            assert.equal(WillOriginal.constructor.getUrl(), '/will-original');
            done();
        });
    });

    describe('nextStepUrl', () => {
        it('should return correct next step url', (done) => {
            expect(WillOriginal.nextStepUrl()).to.include('notOriginal');
            done();
        });
    });

    describe('nextStepOptions', () => {
        it('should return correct next step options', (done) => {
            const nextOption = WillOriginal.nextStepOptions();
            expect(nextOption).to.deep.equal({options: [{key: 'original', value: 'Yes', choice: 'isOriginal'}]});
            done();
        });
    });
});
