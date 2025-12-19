'use strict';

const initSteps = require('app/core/initSteps.cjs');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ExecutorWhenDied = steps.ExecutorsWhenDied;
const ExecutorWhenDiedPath = '/executor-when-died/';

describe('ExecutorWhenDied', () => {
    describe('getUrl()', () => {
        it('returns the url with a * param when no index is given', (done) => {
            const url = ExecutorWhenDied.constructor.getUrl();

            expect(url).to.equal(`${ExecutorWhenDiedPath}*`);
            done();
        });

        it('returns the url with the index as a param when an index is given', (done) => {
            const param = 1;
            const url = ExecutorWhenDied.constructor.getUrl(param);

            expect(url).to.equal(ExecutorWhenDiedPath + param);
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;

        it('should return the ctx with the executor roles', (done) => {
            ctx = {
                index: 0,
                list: [{}],
                diedbefore: 'optionNo'
            };
            errors = [];
            [ctx, errors] = ExecutorWhenDied.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                index: -1,
                list: [
                    {
                        diedBefore: 'optionNo',
                        notApplyingKey: 'optionDiedAfter',
                        notApplyingReason: 'optionDiedAfter'
                    }
                ],
                diedbefore: 'optionNo'
            });
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = ExecutorWhenDied.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'continue', value: true, choice: 'continue'},
                    {key: 'allDead', value: true, choice: 'allDead'}
                ]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                diedbefore: 'optionNo',
                continue: true,
                allDead: 'optionNo',
            };
            ExecutorWhenDied.action(ctx);
            assert.isUndefined(ctx.diedbefore);
            assert.isUndefined(ctx.continue);
            assert.isUndefined(ctx.allDead);
        });
    });
    describe('ExecutorsWhenDied generateFields', () => {
        let ctx;
        let errors;
        let language;

        beforeEach(() => {
            ctx = {
                list: [
                    {fullName: 'Executor 1', isDead: true},
                    {fullName: 'Executor 2', isDead: false}
                ],
                deceasedName: 'Deceased Name',
                executorFullName: 'Executor 1'
            };
            errors = [{msg: 'Error message for {deceasedName} and {executorName}'}];
            language = 'en';
        });

        it('should replace {deceasedName} and {executorName} placeholders in error message', () => {
            ExecutorWhenDied.generateFields(language, ctx, errors);
            expect(errors[0].msg).to.equal('Error message for Deceased Name and Executor 1');
        });

        it('should not modify error message if executorFullName is not present in fields', () => {
            ctx.executorFullName = '';
            ExecutorWhenDied.generateFields(language, ctx, errors);
            expect(errors[0].msg).to.equal('Error message for Deceased Name and ');
        });
    });
    describe('ExecutorsWhenDied isComplete', () => {
        let ctx;

        beforeEach(() => {
            ctx = {
                list: [
                    {fullName: 'Executor 1', isDead: true, diedBefore: 'optionYes'},
                    {fullName: 'Executor 2', isDead: true, diedBefore: 'optionNo'},
                    {fullName: 'Executor 3', isDead: false}
                ]
            };
        });

        it('should return inProgress if all dead executors have diedBefore property', () => {
            const result = ExecutorWhenDied.isComplete(ctx);
            expect(result).to.deep.equal([true, 'inProgress']);
        });

        it('should return inProgress if no executors are dead', () => {
            ctx.list = [
                {fullName: 'Executor 1', isDead: false},
                {fullName: 'Executor 2', isDead: false}
            ];
            const result = ExecutorWhenDied.isComplete(ctx);
            expect(result).to.deep.equal([true, 'inProgress']);
        });

        it('should return inProgress if executors list is empty', () => {
            ctx.list = [];
            const result = ExecutorWhenDied.isComplete(ctx);
            expect(result).to.deep.equal([true, 'inProgress']);
        });
    });
});
