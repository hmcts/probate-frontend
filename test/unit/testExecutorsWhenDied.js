'use strict';
const initSteps = require('app/core/initSteps');
const {assert, expect} = require('chai');

describe('ExecutorsWhenDied', () => {
    const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
    const ExecutorsWhenDied = steps.ExecutorsWhenDied;

    describe('getUrl', () => {
        it('returns correct url', () => {
            assert.equal(ExecutorsWhenDied.constructor.getUrl(), '/executor-when-died/*');
        });
    });

    describe('recalcIndex', () => {
        it('returns index of next exec that isDead is true', () => {
            const index = 0;
            const ctx = {list: [{isDead: true}, {isDead: true}, {isDead: false}]};
            const result = ExecutorsWhenDied.recalcIndex(ctx, index);
            expect(result).to.equal(1);
        });
    });

    describe('nextStepOptions', () => {
        it('returns nextstep options', () => {
            const ctx = {};
            const results = ExecutorsWhenDied.nextStepOptions(ctx);
            expect(results).to.deep.equal({options: [{key: 'continue', value: true, choice: 'continue'}, {key: 'allDead', value: true, choice: 'allDead'}]});
        });

        it('sets ctx.allDead to true when all exec are dead', () => {
            const ctx = {list: [{isDead: true}, {isDead: true}]};
            ExecutorsWhenDied.nextStepOptions(ctx);
            expect(ctx.allDead).to.equal(true);
        });

        it('sets ctx.allDead to false when not all execs are dead', () => {
            const ctx = {list: [{isDead: true}, {isDead: false}]};
            ExecutorsWhenDied.nextStepOptions(ctx);
            expect(ctx.allDead).to.equal(false);
        });

        it('sets ctx.continue to true when index is not "-1"', () => {
            const ctx = {index: 1};
            ExecutorsWhenDied.nextStepOptions(ctx);
            expect(ctx.continue).to.equal(true);
        });

        it('sets ctx.continue to false when index is "-1"', () => {
            const ctx = {index: -1};
            ExecutorsWhenDied.nextStepOptions(ctx);
            expect(ctx.continue).to.equal(false);
        });

        it('sets ctx.continue to false if index does not exist', () => {
            const ctx = {};
            ExecutorsWhenDied.nextStepOptions(ctx);
            expect(ctx.continue).to.equal(false);
        });
    });

    describe('isComplete', () => {
        it('return true when all dead execs has "diedBefore"', () => {
            const ctx = {
                list: [
                    {
                        firstName: 'Lead',
                        lastName: 'Applicant',
                        isApplying: true,
                        isApplicant: true
                    },
                    {
                        fullName: 'Bob Cratchett',
                        isDead: true,
                        diedBefore: 'Yes'
                    },
                    {
                        fullName: 'Billy Jean',
                        isApplying: true,
                        emailSent: true
                    }
                ],
            };
            const result = ExecutorsWhenDied.isComplete(ctx);
            expect(result).to.deep.equal([true, 'inProgress']);
        });
    });

    describe('action', () => {
        const ctx ={};
        it('deletes ctx.diedbefore', () => {
            ctx.diedbefore = 'test';
            const [result] = ExecutorsWhenDied.action(ctx);
            expect(result).to.deep.equal({});
            assert.isUndefined(result.diedbefore);
        });

        it('deletes ctx.continue', () => {
            ctx.continue = 'test';
            const [result] = ExecutorsWhenDied.action(ctx);
            expect(result).to.deep.equal({});
            assert.isUndefined(result.continue);
        });

        it('deletes ctx.allDead', () => {
            ctx.allDead = 'test';
            const [result] = ExecutorsWhenDied.action(ctx);
            expect(result).to.deep.equal({});
            assert.isUndefined(result.allDead);
        });
    });
});
