'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const {findIndex, get, startsWith} = require('lodash');
const ExecutorsWrapper = require('app/wrappers/Executors');
const AliasData = require('app/utils/AliasData.js');

const path = '/executor-current-name-reason/';

class ExecutorCurrentNameReason extends ValidationStep {

    static getUrl(index = '*') {
        return path + index;
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
            req.session.indexPosition = ctx.index;
        } else if (req.params && req.params[0] === '*') {
            ctx.index = req.session.indexPosition ||
                findIndex(ctx.list, o => o.hasOtherName && !o.currentNameReason, 1);
        } else if (startsWith(req.path, path)) {
            ctx.index = this.recalcIndex(ctx, 0);
        }
        if (ctx.list && ctx.list[ctx.index]) {
            ctx.otherExecName = ctx.list[ctx.index].currentName;

        }
        return ctx;
    }

    handleGet(ctx) {
        if (ctx.list && ctx.list[ctx.index]) {
            ctx.currentNameReason = ctx.list[ctx.index].currentNameReason;
            ctx.otherReason = ctx.list[ctx.index].otherReason;
        }
        return [ctx];
    }

    handlePost(ctx, errors, formdata) {
        if ((get(formdata, 'declaration.declarationCheckbox', false)).toString() === 'true' &&
            formdata.executors.list[ctx.index].currentNameReason !== ctx.currentNameReason
        ) {
            ctx.currentNameReasonUpdated = true;
        }

        if (ctx.otherReason) {
            ctx.list[ctx.index].otherReason = ctx.otherReason;
        }
        ctx.list[ctx.index].currentNameReason = ctx.currentNameReason;

        if (ctx.currentNameReason !== 'optionOther') {
            delete ctx.list[ctx.index].otherReason;
        }

        ctx.index = this.recalcIndex(ctx, ctx.index);
        return [ctx, errors];
    }

    recalcIndex(ctx, index) {
        return findIndex(ctx.list, o => o.hasOtherName, index + 1);
    }

    nextStepUrl(req, ctx) {
        if (ctx.index === -1) {
            return this.next(req, ctx).constructor.getUrl();
        }
        return this.next(req, ctx).constructor.getUrl(ctx.index);
    }

    nextStepOptions(ctx) {
        ctx.continue = get(ctx, 'index', -1) !== -1;
        return {
            options: [
                {key: 'continue', value: true, choice: 'continue'},
            ],
        };
    }

    isComplete(ctx) {
        const executorsWrapper = new ExecutorsWrapper(ctx);
        return [executorsWrapper.executorsWithAnotherName().every(exec => exec.currentNameReason), 'inProgress'];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);

        if (ctx.currentNameReasonUpdated) {
            formdata = AliasData.resetDeclaration(formdata);
        }

        delete ctx.index;
        delete ctx.currentNameReason;
        delete ctx.otherReason;
        delete ctx.currentNameReasonUpdated;
        return [ctx, formdata];
    }
}

module.exports = ExecutorCurrentNameReason;
