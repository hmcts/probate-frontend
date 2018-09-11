'use strict';
const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');

describe('ExecutorNumber', () => {
    let ctx;
    let formdata;
    const ExecNumber = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]).ExecutorsNumber;

    describe('createExecutorList', () => {
        beforeEach(() => {
            ctx = {};
            formdata = {
                applicant: {
                    'firstName': 'Dave',
                    'lastName': 'Bassett'
                },
                executors: {
                    list: [
                        {
                            'firstName': 'Dave',
                            'lastName': 'Bassett',
                            'isApplying': 'Yes',
                            'isApplicant': true
                        }, {
                            fullName: 'Ed Brown'
                        }, {
                            fullName: 'Dave Miller'
                        }
                    ]
                }
            };
        });

        it('test only the main applicant is in the executors list when executors number is reduced', () => {
            ctx.executorsNumber = 2;
            ctx = ExecNumber.createExecutorList(ctx, formdata);
            assert.lengthOf(ctx.list, 1);
            expect(ctx.list).to.deep.equal([{
                'firstName': 'Dave',
                'lastName': 'Bassett',
                'isApplying': true,
                'isApplicant': true
            }]);
        });

        it('test only the executors list remains the same when executors number is not reduced', () => {
            ctx.executorsNumber = 3;
            ctx = ExecNumber.createExecutorList(ctx, formdata);
            assert.lengthOf(ctx.list, 3);
            expect(ctx.list).to.deep.equal([
                {
                    'firstName': 'Dave',
                    'lastName': 'Bassett',
                    'isApplying': true,
                    'isApplicant': true
                }, {
                    fullName: 'Ed Brown'
                }, {
                    fullName: 'Dave Miller'
                }
            ]);
        });

        it('test only the executors list remains the same when executors number is increased', () => {
            ctx.executorsNumber = 5;
            ctx = ExecNumber.createExecutorList(ctx, formdata);
            assert.lengthOf(ctx.list, 3);
            expect(ctx.list).to.deep.equal([
                {
                    'firstName': 'Dave',
                    'lastName': 'Bassett',
                    'isApplying': true,
                    'isApplicant': true
                }, {
                    fullName: 'Ed Brown'
                }, {
                    fullName: 'Dave Miller'
                }
            ]);
        });
    });
});
