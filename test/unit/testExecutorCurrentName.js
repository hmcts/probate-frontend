'use strict';

const initSteps = require('app/core/initSteps');
const {assert, expect} = require('chai');

describe('ExecutorCurrentName', () => {
    const steps = initSteps([__dirname + '/../../app/steps/action/', __dirname + '/../../app/steps/ui']);

    describe('getUrl', () => {
        it('returns correct url', () => {
            const ExecutorCurrentName = steps.ExecutorCurrentName;
            const url = ExecutorCurrentName.constructor.getUrl();
            expect(url).to.include('/executor-current-name');
        });

        it('appends * when no param is supplied', () => {
            const ExecutorCurrentName = steps.ExecutorCurrentName;
            const url = ExecutorCurrentName.constructor.getUrl();
            expect(url).to.equal('/executor-current-name/*');
        });

        it('appends index when param is supplied', () => {
            const ExecutorCurrentName = steps.ExecutorCurrentName;
            const url = ExecutorCurrentName.constructor.getUrl(1);
            expect(url).to.equal('/executor-current-name/1');
        });
    });

    describe('getContextData()', () => {
        it('sets the index when there is a numeric url param', (done) => {
            const req = {
                session: {
                    form: {
                        executors: {
                            list: []
                        }
                    }
                },
                params: [1]
            };
            const ExecutorCurrentName = steps.ExecutorCurrentName;
            const ctx = ExecutorCurrentName.getContextData(req);

            expect(ctx.index).to.equal(req.params[0]);
            done();
        });

        it('recalculates index when there is a * url param', (done) => {
            const req = {
                session: {
                    form: {
                        executors: {
                            list: [
                                {fullName: 'Prince', hasOtherName: false},
                                {fullName: 'Cher', hasOtherName: true}
                            ]
                        }
                    },
                },
                params: ['*']
            };
            const ExecutorCurrentName = steps.ExecutorCurrentName;
            const ctx = ExecutorCurrentName.getContextData(req);

            expect(ctx.index).to.equal(1);
            done();
        });

        it('returns -1 when there is a * url param and no execs with other name', (done) => {
            const req = {
                session: {
                    form: {
                        executors: {
                            list: []
                        }
                    },
                },
                params: ['*']
            };
            const ExecutorCurrentName = steps.ExecutorCurrentName;
            const ctx = ExecutorCurrentName.getContextData(req);

            expect(ctx.index).to.equal(-1);
            done();
        });
    });

    describe('handleGet', () => {
        it('sets ctx.currentName from ctx.list based on ctx.index', () => {
            const ctx ={
                index: 1,
                list: [{hasOtherName: true, currentName: 'cher'}, {fullName: 'Michael Jackson', hasOtherName: true, currentName: 'Mj'}],
            };
            const ExecutorCurrentName = steps.ExecutorCurrentName;
            const [result] = ExecutorCurrentName.handleGet(ctx);
            expect(result.currentName).to.equal(ctx.list[ctx.index].currentName);
        });

        it('does not amend ctx if ctx.list does not exist', () => {
            const ctx ={
                index: 1,
            };
            const ExecutorCurrentName = steps.ExecutorCurrentName;
            const [result] = ExecutorCurrentName.handleGet(ctx);
            expect(result).to.deep.equal(ctx);
        });
    });

    describe('nextStepOptions()', () => {

        it('ctx.continue returns true when next executor exists in list ', (done) => {

            const testCtx = {
                index: 1,
                list: [
                    {lastName: 'Huggins', firstName: 'Jake', isApplying: true, isApplicant: true},
                    {fullName: 'Madonna', hasOtherName: true},
                    {fullName: 'Prince', hasOtherName: false},
                    {fullName: 'Cher', hasOtherName: true}
                ]
            };

            const ExecutorCurrentName = steps.ExecutorCurrentName;
            const nextStepOptions = ExecutorCurrentName.nextStepOptions(testCtx);

            assert.equal(testCtx.continue, true);

            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'continue', value: true, choice: 'continue'},
                ],
            });
            done();
        });

        it('ctx.continue returns false when at the end of exec list ', (done) => {

            const testCtx = {
                index: -1,
                list: [
                    {lastName: 'Huggins', firstName: 'Jake', isApplying: true, isApplicant: true},
                    {fullName: 'Madonna', hasOtherName: true},
                    {fullName: 'Prince', hasOtherName: false},
                    {fullName: 'Cher', hasOtherName: true}
                ]
            };

            const ExecutorCurrentName = steps.ExecutorCurrentName;
            const nextStepOptions = ExecutorCurrentName.nextStepOptions(testCtx);

            assert.equal(testCtx.continue, false);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'continue', value: true, choice: 'continue'},
                ],
            });
            done();
        });

    });

    describe('action()', () => {
        it('removes the correct values from the context', (done) => {
            const testCtx = {
                currentName: 'leatherface',
                continue: true,
                index: 1,
            };
            const testFormdata = {};
            const ExecutorCurrentName = steps.ExecutorCurrentName;
            const action = ExecutorCurrentName.action(testCtx, testFormdata);

            expect(action).to.deep.equal([{}, testFormdata]);
            done();
        });
    });

    describe('isComplete', () => {
        it('returns true when every executor has "hasOtherName" and "currentName"', () => {
            const ctx ={
                list: [{hasOtherName: true, currentName: 'cher'}, {fullName: 'Michael Jackson', hasOtherName: true, currentName: 'Mj'}],
            };
            const ExecutorCurrentName = steps.ExecutorCurrentName;
            const result = ExecutorCurrentName.isComplete(ctx);
            expect(result).to.deep.equal([true, 'inProgress']);
        });

        it('returns false when an executor has "hasOtherName" bt no "currentName"', () => {
            const ctx ={
                list: [{hasOtherName: true, currentName: 'cher'}, {fullName: 'Michael Jackson', hasOtherName: true}],
            };
            const ExecutorCurrentName = steps.ExecutorCurrentName;
            const result = ExecutorCurrentName.isComplete(ctx);
            expect(result).to.deep.equal([false, 'inProgress']);
        });
    });
});
