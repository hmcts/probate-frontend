const initSteps = require('app/core/initSteps');
const {assert, expect} = require('chai');

describe('WillLeft', () => {

    const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
    const WillLeft = steps.WillLeft;

    describe('getUrl()', () => {
        it('test correct url is returned from getUrl function', (done) => {
            assert.equal(WillLeft.constructor.getUrl(), '/will-left');
            done();
        });
    });

    describe('nextStepUrl', () => {
        it('should return correct next step url', (done) => {
            expect(WillLeft.nextStepUrl()).to.include('noWill');
            done();
        });
    });

    describe('nextStepOptions', () => {
        it('should return correct next step options', (done) => {
            const nextOption = WillLeft.nextStepOptions();
            expect(nextOption).to.deep.equal({options: [{key: 'left', value: 'Yes', choice: 'withWill'}]});
            done();
        });
    });
});
