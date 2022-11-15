'use strict';
const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ExecutorsNumber = steps.ExecutorsNumber;

describe('ExecutorsNumber', () => {
    let ctx;
    let formdata;

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ExecutorsNumber.constructor.getUrl();
            expect(url).to.equal('/executors-number');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = ExecutorsNumber.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'executorsNumber',
                    value: 1,
                    choice: 'oneExecutor'
                }]
            });
            done();
        });
    });

    describe('createExecutorList', () => {
        beforeEach(() => {
            ctx = {};
            formdata = {
                applicant: {
                    'firstName': 'Dave',
                    'lastName': 'Bassett',
                    'nameAsOnTheWill': 'optionYes',
                    'alias': 'David James',
                    'aliasReason': 'Divorce',
                    'otherReason': ''
                },
                executors: {
                    list: [
                        {
                            'firstName': 'Dave',
                            'lastName': 'Bassett',
                            'isApplying': 'optionYes',
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
            ctx = ExecutorsNumber.createExecutorList(ctx, formdata);
            assert.lengthOf(ctx.list, 1);
            expect(ctx.list).to.deep.equal([{
                'firstName': 'Dave',
                'lastName': 'Bassett',
                'nameAsOnTheWill': true,
                'alias': 'David James',
                'aliasReason': 'Divorce',
                'otherReason': '',
                'isApplying': true,
                'isApplicant': true
            }]);
        });

        it('test only the executors list remains the same when executors number is not reduced', () => {
            ctx.executorsNumber = 3;
            ctx = ExecutorsNumber.createExecutorList(ctx, formdata);
            assert.lengthOf(ctx.list, 3);
            expect(ctx.list).to.deep.equal([
                {
                    'firstName': 'Dave',
                    'lastName': 'Bassett',
                    'nameAsOnTheWill': true,
                    'alias': 'David James',
                    'aliasReason': 'Divorce',
                    'otherReason': '',
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
            ctx = ExecutorsNumber.createExecutorList(ctx, formdata);
            assert.lengthOf(ctx.list, 3);
            expect(ctx.list).to.deep.equal([
                {
                    'firstName': 'Dave',
                    'lastName': 'Bassett',
                    'nameAsOnTheWill': true,
                    'alias': 'David James',
                    'aliasReason': 'Divorce',
                    'otherReason': '',
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
