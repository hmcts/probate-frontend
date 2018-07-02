const initSteps = require('app/core/initSteps'),
    assert = require('chai').assert,
    {isNil} = require('lodash');

describe('Executors-Applying', function () {
    let ctx;
    const ExecsDealing = initSteps([__dirname + '/../../app/steps/action/', __dirname + '/../../app/steps/ui']).ExecutorsDealingWithEstate;
    beforeEach(() => {
        ctx = {
            list: [
                {
                    'lastName': 'the',
                    'firstName': 'applicant',
                    'isApplying': 'Yes',
                    'isApplicant': true
                }, {
                    fullName: 'Ed Brown',
                    address: '20 Green Street, London, L12 9LN'
                }, {
                    fullName: 'Dave Miller',
                    address: '102 Petty Street, London, L12 9LN'
                }
            ],
            executorsApplying: ['Dave Miller'],
            executorsNumber: 3
        };
    });

    it('test executors (with checkbox unchecked) isApplying flag is deleted', () => {
        ExecsDealing.handlePost(ctx);
        assert.isTrue(isNil(ctx.list[1].isApplying));
    });

    it('test executors (with checkbox checked) isApplying flag is set to true', () => {
        ExecsDealing.handlePost(ctx);
        assert.isTrue(ctx.list[2].isApplying);
    });
});
