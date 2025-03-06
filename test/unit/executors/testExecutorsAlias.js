'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ExecutorsAlias = steps.ExecutorsAlias;

describe('Executors-Alias', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ExecutorsAlias.constructor.getUrl();
            expect(url).to.equal('/executors-alias/*');
            done();
        });
    });

    describe('pruneFormData()', () => {
        let ctx;

        it('should return the pruned executor list if option No is chosen', (done) => {
            ctx = {
                alias: 'optionNo',
                list: [
                    {fullName: 'Ronnie D', hasOtherName: false, currentName: 'Steve', currentNameReason: 'optionMarriage'},
                    {fullName: 'Aggie D', hasOtherName: false, currentName: 'Danny', currentNameReason: 'optionOther', otherReason: 'Yolo'}
                ]
            };
            ctx = ExecutorsAlias.pruneFormData(ctx);
            expect(ctx).to.deep.equal({
                alias: 'optionNo',
                list: [
                    {fullName: 'Ronnie D', hasOtherName: false},
                    {fullName: 'Aggie D', hasOtherName: false}
                ]
            });
            done();
        });

        it('should return the executor list untouched if option Yes is chosen', (done) => {
            ctx = {
                alias: 'optionYes',
                list: [
                    {currentName: 'Steve', hasOtherName: true, currentNameReason: 'optionMarriage'},
                    {currentName: 'Danny', hasOtherName: true, currentNameReason: 'optionOther', otherReason: 'Yolo'}
                ]
            };
            ctx = ExecutorsAlias.pruneFormData(ctx);
            expect(ctx).to.deep.equal({
                alias: 'optionYes',
                list: [
                    {currentName: 'Steve', hasOtherName: true, currentNameReason: 'optionMarriage'},
                    {currentName: 'Danny', hasOtherName: true, currentNameReason: 'optionOther', otherReason: 'Yolo'}
                ]
            });
            done();
        });
    });

    describe('ExecutorsAlias handleGet', () => {
        let ctx;

        beforeEach(() => {
            ctx = {
                list: [
                    {fullName: 'Executor 1', hasOtherName: false},
                    {fullName: 'Executor 2', hasOtherName: true},
                    {fullName: 'Executor 3'}
                ],
                index: 0
            };
        });

        it('should set alias to optionYes if executor has other name', () => {
            ctx.index = 1;
            [ctx] = ExecutorsAlias.handleGet(ctx);
            expect(ctx.alias).to.equal('optionYes');
        });

        it('should set alias to optionNo if executor does not have other name', () => {
            ctx.index = 0;
            [ctx] = ExecutorsAlias.handleGet(ctx);
            expect(ctx.alias).to.equal('optionNo');
        });

        it('should set alias to empty string if executor hasOtherName is not defined', () => {
            ctx.index = 2;
            [ctx] = ExecutorsAlias.handleGet(ctx);
            expect(ctx.alias).to.equal('');
        });
    });
    describe('ExecutorsAlias nextStepUrl', () => {
        let ctx;
        let req;
        beforeEach(() => {
            ctx = {
                alias: '',
                index: 0,
                list: [
                    {fullName: 'Executor 1', isApplying: true},
                    {fullName: 'Executor 2', isApplying: true}
                ]
            };
            req = {};
        });

        it('should return the URL for the next executor if alias is optionNo and there is another executor', () => {
            ctx.alias = 'optionNo';
            const url = ExecutorsAlias.nextStepUrl(req, ctx);
            expect(url).to.equal('/executors-alias/1');
        });

        it('should return the URL for executor contact details if alias is optionNo and there are no more executors', () => {
            ctx.alias = 'optionNo';
            ctx.index = 1;
            const url = ExecutorsAlias.nextStepUrl(req, ctx);
            expect(url).to.equal('/executor-contact-details/1');
        });

        it('should return the URL for executor ID name if alias is optionYes', () => {
            ctx.alias = 'optionYes';
            const url = ExecutorsAlias.nextStepUrl(req, ctx);
            expect(url).to.equal('/executor-id-name/0');
        });
    });
    describe('ExecutorsAlias generateFields', () => {
        let ctx;
        let errors;
        let language;

        beforeEach(() => {
            ctx = {
                list: [
                    {fullName: 'Executor 1', hasOtherName: false},
                    {fullName: 'Executor 2', hasOtherName: true}
                ],
                otherExecName: 'Executor 2'
            };
            errors = [{msg: 'Error message for {executorName}'}];
            language = 'en';
        });

        it('should replace {executorName} placeholder in error message with executor name', () => {
            ExecutorsAlias.generateFields(language, ctx, errors);
            expect(errors[0].msg).to.equal('Error message for Executor 2');
        });

        it('should not modify error message if otherExecName is not present in fields', () => {
            ctx.otherExecName = '';
            ExecutorsAlias.generateFields(language, ctx, errors);
            expect(errors[0].msg).to.equal('Error message for ');
        });
    });
    describe('isComplete', () => {
        it('returns true and inProgress when all executors are valid', () => {
            const ctx = {
                list: [
                    {fullName: 'Executor one', isApplying: true, hasOtherName: true, currentName: 'John Doe', currentNameReason: 'Legal'},
                    {fullName: 'Executor one', isApplying: true, hasOtherName: false}
                ]
            };
            const result = ExecutorsAlias.isComplete(ctx);
            expect(result).to.deep.equal([true, 'inProgress']);
        });

        it('returns false and inProgress when an executor with other name is missing currentName', () => {
            const ctx = {
                list: [
                    {fullName: 'Executor one', isApplying: true, hasOtherName: true, currentNameReason: 'Legal'},
                    {fullName: 'Executor one', isApplying: true, hasOtherName: false}
                ]
            };
            const result = ExecutorsAlias.isComplete(ctx);
            expect(result).to.deep.equal([false, 'inProgress']);
        });

        it('returns false and inProgress when an executor with other name is missing currentNameReason', () => {
            const ctx = {
                list: [
                    {fullName: 'Executor one', isApplying: true, hasOtherName: true, currentName: 'John Doe'},
                    {fullName: 'Executor one', isApplying: true, hasOtherName: false}
                ]
            };
            const result = ExecutorsAlias.isComplete(ctx);
            expect(result).to.deep.equal([false, 'inProgress']);
        });

        it('returns false and inProgress when an executor with other name is missing both currentName and currentNameReason', () => {
            const ctx = {
                list: [
                    {fullName: 'Executor one', isApplying: true, hasOtherName: true},
                    {fullName: 'Executor one', isApplying: true, hasOtherName: false}
                ]
            };
            const result = ExecutorsAlias.isComplete(ctx);
            expect(result).to.deep.equal([false, 'inProgress']);
        });

        it('returns true and inProgress when all executors have hasOtherName as false', () => {
            const ctx = {
                list: [
                    {fullName: 'Executor one', isApplying: true, hasOtherName: false},
                    {fullName: 'Executor one', isApplying: true, hasOtherName: false}
                ]
            };
            const result = ExecutorsAlias.isComplete(ctx);
            expect(result).to.deep.equal([true, 'inProgress']);
        });
    });
});
