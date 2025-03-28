'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
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

        it('should return the ctx with the executor notified', (done) => {
            ctx = {
                index: 0,
                executorNotified: 'optionYes'
            };
            formdata = {
                executors: {
                    list: [{}]
                }
            };
            errors = [];
            [ctx, errors] = ExecutorNotified.handlePost(ctx, errors, formdata, {language: 'en'});
            expect(ctx).to.deep.equal({
                index: -1,
                executorNotified: 'optionYes'
            });
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = ExecutorNotified.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'nextExecutor', value: true, choice: 'roles'}
                ]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                otherwise: 'something',
                executorNotified: 'optionYes',
                executorName: 'Some name',
                nextExecutor: 'whatever'
            };
            ExecutorNotified.action(ctx);
            assert.isUndefined(ctx.otherwise);
            assert.isUndefined(ctx.executorNotified);
            assert.isUndefined(ctx.executorName);
            assert.isUndefined(ctx.nextExecutor);
        });
    });
    describe('ExecutorNotified generateFields', () => {
        let ctx;
        let errors;
        let language;

        beforeEach(() => {
            ctx = {
                list: [
                    {fullName: 'Executor 1', isDead: false},
                    {fullName: 'Executor 2', isDead: false}
                ],
                executorName: 'Executor 1',
                index: 0
            };
            errors = [{msg: 'Error message for {executorName}'}];
            language = 'en';
        });

        it('should replace {executorName} placeholder in error message if executorName is present', () => {
            ExecutorNotified.generateFields(language, ctx, errors);
            expect(errors[0].msg).to.equal('Error message for Executor 1');
        });

        it('should not modify error message if executorName is not present in fields', () => {
            ctx.executorName = '';
            ExecutorNotified.generateFields(language, ctx, errors);
            expect(errors[0].msg).to.equal('Error message for ');
        });
    });
});
