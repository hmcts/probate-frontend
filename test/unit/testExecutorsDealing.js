'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');

describe('Executors-Applying', function () {
    let ctx;
    let ctxTest;
    let data;
    let errors;
    const ExecsDealing = initSteps([__dirname + '/../../app/steps/action/', __dirname + '/../../app/steps/ui']).ExecutorsDealingWithEstate;
    describe('pruneFormData', () => {

        it('test that isApplying flag is deleted when executor is not applying', () => {
            data = {
                fullName: 'Ed Brown',
                isApplying: false
            };
            ExecsDealing.pruneFormData(data);
            assert.isUndefined(data.isApplying);
            expect(data).to.deep.equal({fullName: 'Ed Brown'});
        });

        it('test that notApplying data is pruned when executor is applying', () => {
            data = {
                fullName: 'Ed Brown',
                isApplying: true,
                isDead: 'not sure',
                diedBefore: 'not sure',
                notApplyingReason: 'not sure',
                notApplyingKey: 'not sure'
            };
            ExecsDealing.pruneFormData(data);
            expect(data).to.deep.equal({
                fullName: 'Ed Brown',
                isApplying: true
            });
        });
    });

    describe('handlePost', () => {
        beforeEach(() => {
            ctxTest = {
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
            [ctx, errors] = ExecsDealing.handlePost(ctxTest);
            assert.isUndefined(ctx.list[1].isApplying);
            assert.isUndefined(errors);
        });

        it('test executors (with checkbox checked) isApplying flag is set to true', () => {
            [ctx, errors] = ExecsDealing.handlePost(ctxTest);
            assert.isTrue(ctx.list[2].isApplying);
            assert.isUndefined(errors);
        });
    });
});
