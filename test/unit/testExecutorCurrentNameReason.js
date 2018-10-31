// eslint-disable-line max-lines

'use strict';

const initSteps = require('app/core/initSteps');
const {assert, expect} = require('chai');
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

        it('sets the index when the url param is "*"', (done) => {
            const req = {
                session: {
                    indexPosition: 2,
                    form: {
                        executors: {
                            list: []
                        }
                    }
                },
                params: ['*']
            };
            const ExecutorCurrentNameReason = steps.ExecutorCurrentNameReason;
            const ctx = ExecutorCurrentNameReason.getContextData(req);

            expect(ctx.index).to.equal(req.session.indexPosition);
            done();
        });

        it('sets the index when the url param is "*" and req.session.indexPosition is not set', (done) => {
            const req = {
                session: {
                    form: {
                        executors: {
                            list: [
                                {currentName: 'executor current name', hasOtherName: true},
                                {currentName: 'bob smith', hasOtherName: true}
                            ]
                        }
                    }
                },
                params: ['*']
            };
            const ExecutorCurrentNameReason = steps.ExecutorCurrentNameReason;
            const ctx = ExecutorCurrentNameReason.getContextData(req);

            expect(ctx.index).to.equal(1);
            done();
        });

        it('sets the index when startsWith(req.path, path)', (done) => {
            const req = {
                path: '/executor-current-name-reason/',
                session: {
                    form: {
                        executors: {
                            list: [
                                {currentName: 'executor current name', hasOtherName: true},
                                {currentName: 'bob smith', hasOtherName: true}
                            ]
                        }
                    }
                },
                params: []
            };
            const ExecutorCurrentNameReason = steps.ExecutorCurrentNameReason;
            const ctx = ExecutorCurrentNameReason.getContextData(req);

            expect(ctx.index).to.equal(1);
            done();
        });

        it('sets otherExecName', (done) => {
            const req = {
                params: {
                    param: '*'
                },
                session: {
                    form: {
                        executors: {
                            list: [
                                {currentName: 'executor current name', hasOtherName: true},
                                {currentName: 'bob smith', hasOtherName: true}
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

    describe('handleGet()', () => {
        let testCtx;

        beforeEach(() => {
            testCtx = {
                list: [{
                    isApplying: true
                }, {
                    isApplying: true,
                    currentNameReason: 'marriage'
                }],
                index: 1
            };
        });

        it('returns the ctx with currentNameReason and otherReason', (done) => {
            testCtx.list[1].otherReason = 'Yolo';
            const ExecutorCurrentNameReason = steps.ExecutorCurrentNameReason;
            const [ctx] = ExecutorCurrentNameReason.handleGet(testCtx);

            expect(ctx).to.deep.equal({
                'currentNameReason': 'marriage',
                'index': 1,
                'list': [
                    {
                        'isApplying': true
                    },
                    {
                        'currentNameReason': 'marriage',
                        'isApplying': true,
                        'otherReason': 'Yolo'
                    }
                ],
                'otherReason': 'Yolo'
            });
            done();
        });

        it('returns the ctx with neither currentNameReason or otherReason', (done) => {
            delete testCtx.list[1].currentNameReason;
            delete testCtx.list[1].otherReason;
            const ExecutorCurrentNameReason = steps.ExecutorCurrentNameReason;
            const [ctx] = ExecutorCurrentNameReason.handleGet(testCtx);

            assert.isUndefined(ctx.currentNameReason);
            assert.isUndefined(ctx.otherReason);
            done();
        });
    });

    describe('handlePost()', () => {
        let testCtx;
        let testErrors;
        let formdata;

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
            formdata = {
                executors: {
                    list: [
                        {currentName: 'bob'}
                    ]
                }
            };
        });

        it('returns the correct data and errors', (done) => {
            const ExecutorCurrentNameReason = steps.ExecutorCurrentNameReason;
            const [ctx, errors] = ExecutorCurrentNameReason.handlePost(testCtx, testErrors, formdata);

            expect(ctx.list[0]).to.deep.equal({
                currentNameReason: 'Marriage',
                isApplying: true,
            });
            expect(errors).to.deep.equal(testErrors);
            done();
        });

        it('returns the correct data for option: "other"', (done) => {
            testCtx.currentNameReason = 'other';
            testCtx.otherReason = 'it was a dare';
            const ExecutorCurrentNameReason = steps.ExecutorCurrentNameReason;
            const [ctx, errors] = ExecutorCurrentNameReason.handlePost(testCtx, testErrors, formdata);

            expect(ctx.list[0]).to.deep.equal({
                currentNameReason: 'other',
                isApplying: true,
                otherReason: 'it was a dare'
            });
            expect(errors).to.deep.equal(testErrors);
            done();
        });

        it('removed otherReason when option is not "other"', (done) => {
            testCtx.currentNameReason = 'marriage';
            testCtx.otherReason = 'it was a dare';
            const ExecutorCurrentNameReason = steps.ExecutorCurrentNameReason;
            const [ctx, errors] = ExecutorCurrentNameReason.handlePost(testCtx, testErrors, formdata);

            expect(ctx.list[0]).to.deep.equal({
                currentNameReason: 'marriage',
                isApplying: true
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
            const ExecutorCurrentNameReason = steps.ExecutorCurrentNameReason;
            const testCtx = {
                index: 2,
                currentNameReason: 'other',
                otherReason: 'it was a dare',
                currentNameReasonUpdated: false
            };
            const testFormdata = {};
            const action = ExecutorCurrentNameReason.action(testCtx, testFormdata);

            expect(action).to.deep.equal([{}, testFormdata]);
            done();
        });

        it('updates the formdata when currentNameReasonUpdated is true and removes values', (done) => {
            const ExecutorCurrentNameReason = steps.ExecutorCurrentNameReason;
            const testCtx = {
                index: 2,
                currentNameReason: 'other',
                otherReason: 'it was a dare',
                currentNameReasonUpdated: true
            };
            const testFormdata = {
                declaration: {
                    declarationCheckbox: 'Yes',
                    hasDataChanged: false
                }
            };
            const action = ExecutorCurrentNameReason.action(testCtx, testFormdata);

            expect(action).to.deep.equal([{}, {declaration: {hasDataChanged: true}}]);
            done();
        });
    });

});
