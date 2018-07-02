const initSteps = require('app/core/initSteps'),
    assert = require('chai').assert,
    {isNil} = require('lodash');

describe('Executors-Applying', function () {

    const ExecsApplying = initSteps([__dirname + '/../../app/steps/action/', __dirname + '/../../app/steps/ui']).ExecutorsApplying;

    it('test executor isApplying flag is deleted', () => {
        const ctx = {
            'list': [
                {
                    'lastName': 'the',
                    'firstName': 'applicant',
                    'isApplying': 'Yes',
                    'isApplicant': true
                }, {
                    isApplying: true,
                    fullName: 'Ed Brown',
                    address: '20 Green Street, London, L12 9LN'
                }, {
                    isApplying: true,
                    fullName: 'Dave Miller',
                    address: '102 Petty Street, London, L12 9LN'
                }
            ],
            otherExecutorsApplying: 'No'
        };

        ExecsApplying.handlePost(ctx);
        assert.isTrue(isNil(ctx.list[1].isApplying));
        assert.isTrue(isNil(ctx.list[2].isApplying));
    });
});
