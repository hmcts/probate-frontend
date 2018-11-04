'use strict';

const ExecutorsWrapper = require('app/wrappers/Executors');
const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const executorForm = require('test/data/complete-form').formdata.executors;

describe('ExecutorsWithOtherNames', () => {
    const steps = initSteps([__dirname + '/../../app/steps/action/', __dirname + '/../../app/steps/ui']);
    const ExecutorsWithOtherNames = steps.ExecutorsWithOtherNames;

    describe('getUrl', () => {
        it('returns the correct url', () => {
            const url = ExecutorsWithOtherNames.constructor.getUrl();
            expect(url).to.equal('/executors-other-names');
        });
    });

    describe('getContextData', () => {
        it('sets ctx.options with applying executors', () => {
            const req = {
                session: {
                    form: {
                        executors: {
                            'list': [
                                {'fullName': 'john', 'isApplying': true, 'isApplicant': true},
                                {'fullName': 'harvey', 'isApplying': true}
                            ]
                        }
                    }
                }
            };

            const ctx = ExecutorsWithOtherNames.getContextData(req);
            expect(ctx.options).to.deep.equal([{option: 'harvey', checked: false}]);
        });

        it('sets ctx.options.checked to true if executor hasOtherName', () => {
            const req = {
                session: {
                    form: {
                        executors: {
                            'list': [
                                {'fullName': 'john', 'isApplying': true, 'isApplicant': true},
                                {'fullName': 'harvey', 'isApplying': true, hasOtherName: true}
                            ]
                        }
                    }
                }
            };

            const ctx = ExecutorsWithOtherNames.getContextData(req);
            expect(ctx.options).to.deep.equal([{option: 'harvey', checked: true}]);
        });

        it('returns empty options is no executor is applying', () => {
            const req = {
                session: {
                    form: {
                        executors: {
                            'list': [
                                {'fullName': 'john', 'isApplying': true, 'isApplicant': true},
                                {'fullName': 'harvey', 'isApplying': false}
                            ]
                        }
                    }
                }
            };

            const ctx = ExecutorsWithOtherNames.getContextData(req);
            expect(ctx.options).to.deep.equal([]);
        });
    });

    describe('pruneFormData', () => {
        it('test that currentNameReason and otherReason are deleted when executor hasOtherName is false', () => {
            const ExecutorsWithOtherNames = steps.ExecutorsWithOtherNames;
            const data = {
                fullName: 'Ed Brown',
                hasOtherName: false,
                currentNameReason: 'other',
                otherReason: 'Stage Name',
                currentName: 'Prince',
            };
            ExecutorsWithOtherNames.pruneFormData(data);
            assert.isUndefined(data.currentName);
            assert.isUndefined(data.otherReason);
            expect(data).to.deep.equal({
                fullName: 'Ed Brown',
                hasOtherName: false
            });
        });
    });

    describe('action', () => {
        it('action deletes options', () => {
            const ctx = {options: 'test'};
            const [result] = ExecutorsWithOtherNames.action(ctx);
            expect(result).to.deep.equal({});
            assert.isUndefined(result.options);
        });

        it('action deletes executorsWithOtherNames', () => {
            const ctx = {executorsWithOtherNames: 'test'};
            const [result] = ExecutorsWithOtherNames.action(ctx);
            expect(result).to.deep.equal({});
            assert.isUndefined(result.executorsWithOtherNames);
        });

        it('action deletes executorsWrapper', () => {
            const ctx = {executorsWrapper: 'test'};
            const [result] = ExecutorsWithOtherNames.action(ctx);
            expect(result).to.deep.equal({});
            assert.isUndefined(result.executorsWrapper);
        });
    });

    describe('isComplete', () => {
        it('returns false if hasOtherName is false', () => {
            const ctx ={
                executorsWrapper: new ExecutorsWrapper(executorForm)
            };
            const isComplete = ExecutorsWithOtherNames.isComplete(ctx);
            expect(isComplete).to.deep.equal([false, 'inProgress']);
        });

        it('returns true if exec hasOtherName is true', () => {
            const execList = {
                list: [{hasOtherName: true}]
            };
            const ctx ={
                executorsWrapper: new ExecutorsWrapper(execList)
            };
            const isComplete = ExecutorsWithOtherNames.isComplete(ctx);
            expect(isComplete).to.deep.equal([true, 'inProgress']);
        });
    });

});
