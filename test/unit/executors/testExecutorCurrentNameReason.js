// eslint-disable-line max-lines

'use strict';

const initSteps = require('app/core/initSteps');
const {assert, expect} = require('chai');
const ExecutorsWrapper = require('app/wrappers/Executors');
const journey = require('app/journeys/probate');
const executorCurrentNameReasonPath = '/executor-current-name-reason';

describe('ExecutorCurrentNameReason', () => {
    const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
    const ExecutorCurrentNameReason = steps.ExecutorCurrentNameReason;

    describe('getUrl()', () => {
        it('returns the url with a * param when no index is given', (done) => {
            const url = ExecutorCurrentNameReason.constructor.getUrl();

            expect(url).to.equal(`${executorCurrentNameReasonPath}*`);
            done();
        });

        it('returns the url with the index as a param when an index is given', (done) => {
            const param = 1;
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
                    currentNameReason: 'optionMarriage'
                }],
                index: 1
            };
        });

        it('returns the ctx with currentNameReason and otherReason', (done) => {
            testCtx.list[1].otherReason = 'Yolo';
            const [ctx] = ExecutorCurrentNameReason.handleGet(testCtx);

            expect(ctx).to.deep.equal({
                currentNameReason: 'optionMarriage',
                index: 1,
                list: [
                    {
                        isApplying: true
                    },
                    {
                        currentNameReason: 'optionMarriage',
                        isApplying: true,
                        otherReason: 'Yolo'
                    }
                ],
                otherReason: 'Yolo'
            });
            done();
        });

        it('returns the ctx with neither currentNameReason or otherReason', (done) => {
            delete testCtx.list[1].currentNameReason;
            delete testCtx.list[1].otherReason;
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
                currentNameReason: 'optionMarriage'
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
            const [ctx, errors] = ExecutorCurrentNameReason.handlePost(testCtx, testErrors, formdata);

            expect(ctx.list[0]).to.deep.equal({
                currentNameReason: 'optionMarriage',
                isApplying: true,
            });
            expect(errors).to.deep.equal(testErrors);
            done();
        });

        it('returns the correct data for option: "other"', (done) => {
            testCtx.currentNameReason = 'optionOther';
            testCtx.otherReason = 'it was a dare';
            const [ctx, errors] = ExecutorCurrentNameReason.handlePost(testCtx, testErrors, formdata);

            expect(ctx.list[0]).to.deep.equal({
                currentNameReason: 'optionOther',
                isApplying: true,
                otherReason: 'it was a dare'
            });
            expect(errors).to.deep.equal(testErrors);
            done();
        });

        it('removed otherReason when option is not "other"', (done) => {
            testCtx.currentNameReason = 'optionMarriage';
            testCtx.otherReason = 'it was a dare';
            const [ctx, errors] = ExecutorCurrentNameReason.handlePost(testCtx, testErrors, formdata);

            expect(ctx.list[0]).to.deep.equal({
                currentNameReason: 'optionMarriage',
                isApplying: true
            });
            expect(errors).to.deep.equal(testErrors);
            done();
        });

        it('sets the currentNameReasonUpdated after declaration and changes to the currentNameReason', (done) => {
            formdata.declaration = {declarationCheckbox: 'true'};
            testCtx.currentNameReason = 'optionMarriage';
            const [ctx, errors] = ExecutorCurrentNameReason.handlePost(testCtx, testErrors, formdata);
            expect(ctx).to.deep.equal({
                currentNameReasonUpdated: true,
                list: [{
                    currentNameReason: 'optionMarriage',
                    isApplying: true,
                }, {
                    isApplying: true
                }],
                index: -1,
                executorsWrapper: new ExecutorsWrapper(),
                currentNameReason: 'optionMarriage'
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

    describe('nextStepUrl()', () => {
        it('should return url for the next step if the index is -1', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                index: -1
            };
            const ExecutorCurrentNameReason = steps.ExecutorCurrentNameReason;
            const nextStepUrl = ExecutorCurrentNameReason.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/executor-contact-details/*');
            done();
        });

        it('should return url for the next step if the index is not -1', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                index: 1
            };
            const ExecutorCurrentNameReason = steps.ExecutorCurrentNameReason;
            const nextStepUrl = ExecutorCurrentNameReason.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/executor-current-name/1');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('returns the next step options', (done) => {
            const testCtx = {
                index: 1,
                executorsWrapper: new ExecutorsWrapper()
            };
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
                index: 2,
                currentNameReason: 'optionOther',
                otherReason: 'it was a dare',
                currentNameReasonUpdated: false
            };
            const testFormdata = {};
            const action = ExecutorCurrentNameReason.action(testCtx, testFormdata);

            expect(action).to.deep.equal([{}, testFormdata]);
            done();
        });

        it('updates the formdata when currentNameReasonUpdated is true and removes values', (done) => {
            const testCtx = {
                index: 2,
                currentNameReason: 'optionOther',
                otherReason: 'it was a dare',
                currentNameReasonUpdated: true
            };
            const testFormdata = {
                declaration: {
                    declarationCheckbox: 'true',
                    hasDataChanged: false
                }
            };
            const action = ExecutorCurrentNameReason.action(testCtx, testFormdata);

            expect(action).to.deep.equal([{}, {declaration: {hasDataChanged: true}}]);
            done();
        });
    });
});
