'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const ExecutorNotified = steps.ExecutorNotified;
const ExecutorNotifiedPath = '/executor-notified/';

describe('ExecutorNotified', () => {
    describe('getUrl()', () => {
        it('returns the url with a * param when no index is given', (done) => {
            const url = ExecutorNotified.constructor.getUrl();

            expect(url).to.equal(`${ExecutorNotifiedPath}*`);
            done();
        });

        it('returns the url with the index as a param when an index is given', (done) => {
            const param = 1;
            const url = ExecutorNotified.constructor.getUrl(param);

            expect(url).to.equal(ExecutorNotifiedPath + param);
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;
        let formdata;
        let session;
        let hostname;
        let featureToggles;

        it('should return the ctx with the executor notified and the screening_question feature toggle', (done) => {
            ctx = {
                index: 0,
                executorNotified: 'Yes'
            };
            formdata = {
                executors: {
                    list: [{}]
                }
            };
            errors = {};
            [ctx, errors] = ExecutorNotified.handlePost(ctx, errors, formdata, session, hostname, featureToggles);
            expect(ctx).to.deep.equal({
                index: -1,
                executorNotified: 'Yes',
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
            const nextStepOptions = ExecutorNotified.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'nextExecutor', value: true, choice: 'roles'}
                ]
            });
            done();
        });

        it('should return the correct options when the FT is on', (done) => {
            const ctx = {
                isToggleEnabled: true
            };
            const nextStepOptions = ExecutorNotified.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'nextExecutor', value: true, choice: 'roles'},
                    {key: 'otherwise', value: true, choice: 'otherwiseToggleOn'}
                ]
            });
            done();
        });

        it('sets nextExecutor to true if index exists', () => {
            const ctx = {index: 1};
            ExecutorNotified.nextStepOptions(ctx);
            expect(ctx.nextExecutor).to.equal(true);
        });

        it('sets nextExecutor to false if index is "-1"', () => {
            const ctx = {index: -1};
            ExecutorNotified.nextStepOptions(ctx);
            expect(ctx.nextExecutor).to.equal(false);
        });

        it('sets nextExecutor to false if index is undefined', () => {
            const ctx = {};
            ExecutorNotified.nextStepOptions(ctx);
            expect(ctx.nextExecutor).to.equal(false);
        });
    });

    describe('action', () => {
        it('test it cleans up context', () => {
            const ctx = {
                otherwise: 'something',
                isToggleEnabled: false,
                executorNotified: 'Yes',
                executorName: 'Some name',
                nextExecutor: 'whatever'
            };
            ExecutorNotified.action(ctx);
            assert.isUndefined(ctx.otherwise);
            assert.isUndefined(ctx.isToggleEnabled);
            assert.isUndefined(ctx.executorNotified);
            assert.isUndefined(ctx.executorName);
            assert.isUndefined(ctx.nextExecutor);
        });

        it('deletes executorNotified from ctx', () => {
            const ctx = {
                executorNotified: 'test'
            };
            const [result] = ExecutorNotified.action(ctx);
            expect(result).to.deep.equal({});
            assert.isUndefined(ctx.executorNotified);
        });

        it('deletes executorName from ctx', () => {
            const ctx = {
                executorName: 'test'
            };
            const [result] = ExecutorNotified.action(ctx);
            expect(result).to.deep.equal({});
            assert.isUndefined(ctx.executorName);
        });

        it('deletes nextExecutor from ctx', () => {
            const ctx = {
                nextExecutor: 'test'
            };
            const [result] = ExecutorNotified.action(ctx);
            expect(result).to.deep.equal({});
            assert.isUndefined(ctx.nextExecutor);
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
            const nextIndex = ExecutorNotified.recalcIndex(ctx, index);
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
            const nextIndex = ExecutorNotified.recalcIndex(ctx, index);
            expect(nextIndex).to.equal(-1);
        });
    });

});
