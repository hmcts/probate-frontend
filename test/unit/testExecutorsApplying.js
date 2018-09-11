'use strict';
const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;

describe('Executors-Applying', function () {
    let ctx;
    const ExecsApplying = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]).ExecutorsApplying;

    describe('handlePost', () => {

        beforeEach(() => {
            ctx = {
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
            };
        });

        it('test executor isApplying flag is deleted when No option is selected', () => {
            ctx.otherExecutorsApplying = 'No';
            ExecsApplying.handlePost(ctx);
            assert.isUndefined(ctx.list[1].isApplying);
            assert.isUndefined(ctx.list[2].isApplying);
        });

        it('test executor isApplying flag is true when Yes option selected', () => {
            ctx.otherExecutorsApplying = 'Yes';
            ExecsApplying.handlePost(ctx);
            assert.isTrue(ctx.list[1].isApplying);
            assert.isTrue(ctx.list[2].isApplying);
        });
    });
});
