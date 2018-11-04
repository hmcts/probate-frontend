'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const ExecutorRoles = steps.ExecutorRoles;
const executorRolesPath = '/executor-roles/';
const json = require('app/resources/en/translation/executors/roles');

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

    describe('handleGet', () => {
        it('sets list.notApplyingReason to ctx if ctx.isApplying is false', () => {
            const ctx = {
                index: 0,
                list: [{notApplyingReason: 'test'}],
            };
            const [result] = ExecutorRoles.handleGet(ctx);
            expect(result.notApplyingReason).to.equal('test');
            expect(result.isApplying).to.equal(false);
        });

        it('does not change ctx if no element in list based on index', () => {
            const ctx = {
                index: 1,
                list: [{notApplyingReason: 'test'}],
            };
            const [result] = ExecutorRoles.handleGet(ctx);
            expect(result).to.deep.equal(ctx);
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;
        let formdata;
        let session;
        let hostname;
        let featureToggles;

        it('should return the ctx with the executor roles and the screening_question feature toggle', (done) => {
            ctx = {
                index: 0,
                list: [
                    {
                        isApplying: false,
                        notApplyingReason: json.optionPowerReserved,
                        notApplyingKey: 'optionPowerReserved'
                    }
                ],
                notApplyingReason: json.optionPowerReserved
            };
            errors = {};
            [ctx, errors] = ExecutorRoles.handlePost(ctx, errors, formdata, session, hostname, featureToggles);
            expect(ctx).to.deep.equal({
                index: 0,
                list: [
                    {
                        isApplying: false,
                        notApplyingReason: json.optionPowerReserved,
                        notApplyingKey: 'optionPowerReserved'
                    }
                ],
                notApplyingReason: json.optionPowerReserved,
                isToggleEnabled: false
            });
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options when the FT is off', (done) => {
            const ctx = {
                isToggleEnabled: false
            };
            const nextStepOptions = ExecutorRoles.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'notApplyingReason', value: json.optionPowerReserved, choice: 'powerReserved'},
                    {key: 'continue', value: true, choice: 'continue'}
                ]
            });
            done();
        });

        it('should return the correct options when the FT is on', (done) => {
            const ctx = {
                isToggleEnabled: true
            };
            const nextStepOptions = ExecutorRoles.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'notApplyingReason', value: json.optionPowerReserved, choice: 'powerReserved'},
                    {key: 'continue', value: true, choice: 'continue'},
                    {key: 'otherwise', value: true, choice: 'otherwiseToggleOn'}
                ]
            });
            done();
        });

        it('sets ctx.continue to true when index is not "-1"', () => {
            const ctx = {index: 1};
            ExecutorRoles.nextStepOptions(ctx);
            expect(ctx.continue).to.equal(true);
        });

        it('sets ctx.continue to false when index is "-1"', () => {
            const ctx = {index: -1};
            ExecutorRoles.nextStepOptions(ctx);
            expect(ctx.continue).to.equal(false);
        });

        it('sets ctx.continue to false if index does not exist', () => {
            const ctx = {};
            ExecutorRoles.nextStepOptions(ctx);
            expect(ctx.continue).to.equal(false);
        });
    });

    describe('action', () => {
        const ctx ={};

        it('test it cleans up context', () => {
            const ctx = {
                otherwise: 'something',
                isToggleEnabled: false,
                executorName: 'executorName',
                isApplying: true,
                notApplyingReason: 'whatever',
                continue: true
            };
            ExecutorRoles.action(ctx);
            assert.isUndefined(ctx.otherwise);
            assert.isUndefined(ctx.isToggleEnabled);
            assert.isUndefined(ctx.executorName);
            assert.isUndefined(ctx.isApplying);
            assert.isUndefined(ctx.notApplyingReason);
            assert.isUndefined(ctx.continue);
        });

        it('deletes ctx.executorName', () => {
            ctx.executorName = 'test';
            const [result] = ExecutorRoles.action(ctx);
            expect(result).to.deep.equal({});
            assert.isUndefined(result.executorName);
        });

        it('deletes ctx.isApplying', () => {
            ctx.isApplying = 'test';
            const [result] = ExecutorRoles.action(ctx);
            expect(result).to.deep.equal({});
            assert.isUndefined(result.isApplying);
        });

        it('deletes ctx.notApplyingReason', () => {
            ctx.notApplyingReason = 'test';
            const [result] = ExecutorRoles.action(ctx);
            expect(result).to.deep.equal({});
            assert.isUndefined(result.notApplyingReason);
        });

        it('deletes ctx.continue', () => {
            ctx.continue = 'test';
            const [result] = ExecutorRoles.action(ctx);
            expect(result).to.deep.equal({});
            assert.isUndefined(result.continue);
        });
    });

    describe('isComplete', () => {
        it('returns true is every exec isApplying', () => {
            const ctx = {
                list: [{isApplying: true}, {isApplying: true}],
            };
            const isComplete = ExecutorRoles.isComplete(ctx);
            expect(isComplete).to.deep.equal([true, 'inProgress']);
        });

        it('returns true is every exec isApplying OR has notApplyingReason', () => {
            const ctx = {
                list: [{notApplyingReason: 'This executor doesnt want to apply now but may do in the future'}, {isApplying: true}],
            };
            const isComplete = ExecutorRoles.isComplete(ctx);
            expect(isComplete).to.deep.equal([true, 'inProgress']);
        });

        it('returns false if not all execs are applying', () => {
            const ctx = {
                list: [{isApplying: false}, {isApplying: true}],
            };
            const isComplete = ExecutorRoles.isComplete(ctx);
            expect(isComplete).to.deep.equal([false, 'inProgress']);
        });
    });

    describe('recalcIndex', () => {
        it('returns index of next alive exec', () => {
            const index = 0;
            const ctx = {
                executorsNumber: 3,
                list: [
                    {
                        firstName: 'Lead',
                        lastName: 'Applicant',
                        isApplying: true,
                        isApplicant: true
                    },
                    {
                        fullName: 'Bob Cratchett',
                        isApplying: false,
                        isDead: true,
                    },
                    {
                        fullName: 'Billy Jean',
                    }
                ],
            };
            const nextIndex = ExecutorRoles.recalcIndex(ctx, index);
            expect(nextIndex).to.equal(2);
        });

        it('returns -1 when no execs are alive', () => {
            const index = 0;
            const ctx = {
                executorsNumber: 3,
                list: [
                    {
                        firstName: 'Lead',
                        lastName: 'Applicant',
                        isApplying: true,
                        isApplicant: true
                    },
                    {
                        fullName: 'Bob Cratchett',
                        isDead: true
                    },
                    {
                        fullName: 'Billy Jean',
                        isDead: true
                    }
                ],
            };
            const nextIndex = ExecutorRoles.recalcIndex(ctx, index);
            expect(nextIndex).to.equal(-1);
        });
    });
});
