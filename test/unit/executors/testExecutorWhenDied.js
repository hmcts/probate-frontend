'use strict';

const initSteps = require('app/core/initSteps');
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
});
