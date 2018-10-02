'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const ExecutorsWrapper = require('app/wrappers/Executors');
const executorCurrentNameReasonPath = '/executor-current-name-reason/';

describe('ExecutorCurrentNameReason', () => {
    const steps = initSteps([__dirname + '/../../app/steps/action/', __dirname + '/../../app/steps/ui']);

    describe('getUrl()', () => {
        it('returns the url with a * param when no index is given', (done) => {
            const ExecutorCurrentNameReason = steps.ExecutorCurrentNameReason;
            const url = ExecutorCurrentNameReason.constructor.getUrl();

            expect(url).to.equal(`${executorCurrentNameReasonPath}*`);
            done();
        });

        it('returns the url with the index as a param when an index is given', (done) => {
            const param = 1;
            const ExecutorCurrentNameReason = steps.ExecutorCurrentNameReason;
            const url = ExecutorCurrentNameReason.constructor.getUrl(param);

            expect(url).to.equal(executorCurrentNameReasonPath + param);
            done();
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
            const ExecutorCurrentNameReason = steps.ExecutorCurrentNameReason;
            const ctx = ExecutorCurrentNameReason.getContextData(req);

            expect(ctx.index).to.equal(req.params[0]);
            done();
        });

        it('sets otherExecName', (done) => {
            const req = {
                session: {
                    form: {
                        executors: {
                            list: [
                                {currentName: 'executor current name'}
                            ],
                            index: 0
                        }
                    }
                }
            };
            const executors = req.session.form.executors;
            const ExecutorCurrentNameReason = steps.ExecutorCurrentNameReason;
            const ctx = ExecutorCurrentNameReason.getContextData(req);

            expect(ctx.otherExecName).to.equal(executors.list[0].currentName);
            done();
        });
    });

    describe('handlePost()', () => {
        let testCtx;
        let testErrors;

        beforeEach(() => {
            testCtx = {
                list: [{
                    isApplying: true,
                }, {
                    isApplying: true
                }],
                index: 0,
                executorsWrapper: new ExecutorsWrapper(),
                currentNameReason: 'Marriage'
            };
            testErrors = [];
        });

        it('returns the correct data and errors', (done) => {
            const ExecutorCurrentNameReason = steps.ExecutorCurrentNameReason;
            const [ctx, errors] = ExecutorCurrentNameReason.handlePost(testCtx, testErrors);

            expect(ctx.list[0]).to.deep.equal({
                currentNameReason: 'Marriage',
                isApplying: true,
            });
            expect(errors).to.deep.equal(testErrors);
            done();
        });

        it('returns the correct data for option:"other"', (done) => {
            testCtx.currentNameReason = 'other';
            testCtx.otherReason = 'it was a dare';
            const ExecutorCurrentNameReason = steps.ExecutorCurrentNameReason;
            const [ctx, errors] = ExecutorCurrentNameReason.handlePost(testCtx, testErrors);

            expect(ctx.list[0]).to.deep.equal({
                currentNameReason: 'other',
                isApplying: true,
                otherReason: 'it was a dare'
            });
            expect(errors).to.deep.equal(testErrors);
            done();
        });
    });

    describe('recalcIndex()', () => {
        it('returns the index when an executor can be found', (done) => {
            const testCtx = {
                list: [
                    {isApplying: true, hasOtherName: true},
                    {isApplying: true, hasOtherName: false},
                    {isApplying: true, hasOtherName: true}
                ]
            };
            const ExecutorCurrentNameReason = steps.ExecutorCurrentNameReason;
            const index = ExecutorCurrentNameReason.recalcIndex(testCtx, 0);

            expect(index).to.equal(2);
            done();
        });

        it('returns -1 when an executor cannot be found', (done) => {
            const testCtx = {
                list: []
            };
            const ExecutorCurrentNameReason = steps.ExecutorCurrentNameReason;
            const index = ExecutorCurrentNameReason.recalcIndex(testCtx, 0);

            expect(index).to.equal(-1);
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('returns the next step options', (done) => {
            const testCtx = {
                index: 1,
                executorsWrapper: new ExecutorsWrapper()
            };
            const ExecutorCurrentNameReason = steps.ExecutorCurrentNameReason;
            const nextStepOptions = ExecutorCurrentNameReason.nextStepOptions(testCtx);

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
                currentNameReason: 'other',
                otherReason: 'it was a dare',
            };
            const testFormdata = {};
            const ExecutorCurrentNameReason = steps.ExecutorCurrentNameReason;
            const action = ExecutorCurrentNameReason.action(testCtx, testFormdata);

            expect(action).to.deep.equal([{}, testFormdata]);
            done();
        });
    });

});
