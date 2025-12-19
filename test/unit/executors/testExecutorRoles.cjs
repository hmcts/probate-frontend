'use strict';

const initSteps = require('app/core/initSteps.cjs');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ExecutorRoles = steps.ExecutorRoles;
const executorRolesPath = '/executor-roles/';

describe('ExecutorRoles', () => {
    describe('getUrl()', () => {
        it('returns the url with a * param when no index is given', (done) => {
            const url = ExecutorRoles.constructor.getUrl();

            expect(url).to.equal(`${executorRolesPath}*`);
            done();
        });

        it('returns the url with the index as a param when an index is given', (done) => {
            const param = 1;
            const url = ExecutorRoles.constructor.getUrl(param);

            expect(url).to.equal(executorRolesPath + param);
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;

        it('should return the ctx with the executor roles', (done) => {
            ctx = {
                index: 0,
                list: [
                    {
                        isApplying: false,
                        notApplyingReason: 'optionPowerReserved',
                        notApplyingKey: 'optionPowerReserved'
                    }
                ],
                notApplyingReason: 'optionPowerReserved'
            };
            errors = [];
            [ctx, errors] = ExecutorRoles.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                index: 0,
                list: [
                    {
                        isApplying: false,
                        notApplyingReason: 'optionPowerReserved',
                        notApplyingKey: 'optionPowerReserved'
                    }
                ],
                notApplyingReason: 'optionPowerReserved'
            });
            done();
        });
    });

    describe('pruneExecutorData', () => {
        const ctx = {
            'list': [
                {
                    'lastName': 'Applicant',
                    'firstName': 'Main',
                    'isApplying': true,
                    'isApplicant': true
                },
                {
                    'email': 'probate0@mailinator.com',
                    'mobile': '07900123456',
                    'address': 'Princes house address',
                    'postcode': 'NW1 8SS',
                    'fullName': 'Prince Rogers Nelson',
                    'hasOtherName': true,
                    'currentName': 'Prince',
                    'isApplying': false,
                    'notApplyingKey': 'optionRenunciated',
                    'notApplyingReason': 'optionRenunciated',
                    'currentNameReason': 'Divorce',

                }
            ]
        };

        it('removes email from executor list data', () => {
            const data = ExecutorRoles.pruneExecutorData(ctx.list[1]);
            assert.isUndefined(data.email);
        });

        it('removes mobile from executor list data', () => {
            const data = ExecutorRoles.pruneExecutorData(ctx.list[1]);
            assert.isUndefined(data.mobile);
        });

        it('removes address from executor list data', () => {
            const data = ExecutorRoles.pruneExecutorData(ctx.list[1]);
            assert.isUndefined(data.address);
        });

        it('removes postcode from executor list data', () => {
            const data = ExecutorRoles.pruneExecutorData(ctx.list[1]);
            assert.isUndefined(data.postcode);
        });

        it('removes currentName from executor list data', () => {
            const data = ExecutorRoles.pruneExecutorData(ctx.list[1]);
            assert.isUndefined(data.currentName);
        });

        it('removes hasOtherName from executor list data', () => {
            const data = ExecutorRoles.pruneExecutorData(ctx.list[1]);
            assert.isUndefined(data.hasOtherName);
        });

        it('removes currentNameReason from executor list data', () => {
            const data = ExecutorRoles.pruneExecutorData(ctx.list[1]);
            assert.isUndefined(data.currentNameReason);
        });

    });

    describe('isComplete()', () => {
        it('should return the correct step completion status when all executors are applying', (done) => {
            const ctx = {
                list: [
                    {
                        'lastName': 'the',
                        'firstName': 'applicant',
                        'isApplying': 'optionYes',
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
            const isComplete = ExecutorRoles.isComplete(ctx);
            expect(isComplete).to.deep.equal([true, 'inProgress']);
            done();
        });

        it('should return the correct step completion status when not all executors are applying', (done) => {
            const ctx = {
                list: [
                    {
                        'lastName': 'the',
                        'firstName': 'applicant',
                        'isApplying': 'optionYes',
                        'isApplicant': true
                    }, {
                        isApplying: false,
                        fullName: 'Ed Brown',
                        address: '20 Green Street, London, L12 9LN'
                    }, {
                        isApplying: true,
                        fullName: 'Dave Miller',
                        address: '102 Petty Street, London, L12 9LN'
                    }
                ],
            };
            const isComplete = ExecutorRoles.isComplete(ctx);
            expect(isComplete).to.deep.equal([false, 'inProgress']);
            done();
        });

        it('should return the correct step completion status when some executors are not applying and their reason is power reserved and the notify question has been answered', (done) => {
            const ctx = {
                list: [
                    {
                        'lastName': 'the',
                        'firstName': 'applicant',
                        'isApplying': 'optionYes',
                        'isApplicant': true
                    }, {
                        isApplying: false,
                        notApplyingReason: 'optionPowerReserved',
                        notApplyingKey: 'optionPowerReserved',
                        executorNotified: 'optionYes',
                        fullName: 'Ed Brown',
                        address: '20 Green Street, London, L12 9LN'
                    }, {
                        isApplying: true,
                        fullName: 'Dave Miller',
                        address: '102 Petty Street, London, L12 9LN'
                    }
                ],
            };
            const isComplete = ExecutorRoles.isComplete(ctx);
            expect(isComplete).to.deep.equal([true, 'inProgress']);
            done();
        });

        it('should return the correct step completion status when some executors are not applying and their reason is power reserved and the notify question has not been answered', (done) => {
            const ctx = {
                list: [
                    {
                        'lastName': 'the',
                        'firstName': 'applicant',
                        'isApplying': 'optionYes',
                        'isApplicant': true
                    }, {
                        isApplying: false,
                        notApplyingReason: 'optionPowerReserved',
                        notApplyingKey: 'optionPowerReserved',
                        fullName: 'Ed Brown',
                        address: '20 Green Street, London, L12 9LN'
                    }, {
                        isApplying: true,
                        fullName: 'Dave Miller',
                        address: '102 Petty Street, London, L12 9LN'
                    }
                ],
            };
            const isComplete = ExecutorRoles.isComplete(ctx);
            expect(isComplete).to.deep.equal([false, 'inProgress']);
            done();
        });

        it('should return the correct step completion status when some executors are not applying and their reason is not power reserved', (done) => {
            const ctx = {
                list: [
                    {
                        'lastName': 'the',
                        'firstName': 'applicant',
                        'isApplying': 'optionYes',
                        'isApplicant': true
                    }, {
                        isApplying: false,
                        notApplyingReason: 'optionRenunciated',
                        notApplyingKey: 'optionRenunciated',
                        fullName: 'Ed Brown',
                        address: '20 Green Street, London, L12 9LN'
                    }, {
                        isApplying: true,
                        fullName: 'Dave Miller',
                        address: '102 Petty Street, London, L12 9LN'
                    }
                ],
            };
            const isComplete = ExecutorRoles.isComplete(ctx);
            expect(isComplete).to.deep.equal([true, 'inProgress']);
            done();
        });
    });

    describe('nextStepOptions()', () => {
        const ctx = {};
        it('should return the correct options', (done) => {
            const nextStepOptions = ExecutorRoles.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'notApplyingReason', value: 'optionPowerReserved', choice: 'powerReserved'},
                    {key: 'continue', value: true, choice: 'continue'}
                ]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                otherwise: 'something',
                executorName: 'executorName',
                isApplying: true,
                notApplyingReason: 'whatever',
                continue: true
            };
            ExecutorRoles.action(ctx);
            assert.isUndefined(ctx.otherwise);
            assert.isUndefined(ctx.executorName);
            assert.isUndefined(ctx.isApplying);
            assert.isUndefined(ctx.notApplyingReason);
            assert.isUndefined(ctx.continue);
        });
    });
});
