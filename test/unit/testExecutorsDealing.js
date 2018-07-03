'use strict';

const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;
const {isNil} = require('lodash');

describe('Executors-Applying', function () {
    let ctx;
    const ExecsDealing = initSteps([__dirname + '/../../app/steps/action/', __dirname + '/../../app/steps/ui']).ExecutorsDealingWithEstate;
    describe('pruneFormData', () => {

        it('test that isApplying flag is deleted when executor is not applying', () => {
            ctx = {
                fullName: 'Ed Brown',
                isApplying: false
            };
            ExecsDealing.pruneFormData(ctx);
            assert.isTrue(isNil(ctx.isApplying));
        });

        it('test that isApplying flag is deleted when executor is not applying', () => {
            ctx = {
                fullName: 'Ed Brown',
                isApplying: true,
                isDead: 'not sure',
                diedBefore: 'not sure',
                notApplyingReason: 'not sure',
                notApplyingKey: 'not sure'
            };
            ExecsDealing.pruneFormData(ctx);
            assert.isTrue(isNil(ctx.isDead));
            assert.isTrue(isNil(ctx.diedBefore));
            assert.isTrue(isNil(ctx.notApplyingReason));
            assert.isTrue(isNil(ctx.notApplyingKey));
        });
    });

    describe('handlePost', () => {
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
});
