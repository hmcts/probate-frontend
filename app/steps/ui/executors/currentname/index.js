'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const {findIndex, get} = require('lodash');
const ExecutorsWrapper = require('app/wrappers/Executors');
const pageUrl = '/executor-id-name';

class ExecutorCurrentName extends ValidationStep {

    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
        } else {
            ctx.index = this.recalcIndex(ctx, 0);
            ctx.redirect = `${pageUrl}/${ctx.index}`;
        }
        ctx.executorName = ctx.list?.[ctx.index] ? ctx.list[ctx.index].fullName : '';
        return ctx;
    }

    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            ctx.currentName = ctx.list[ctx.index].currentName;
        }
        return [ctx];
    }

    handlePost(ctx, errors) {
        ctx.list[ctx.index].currentName = ctx.currentName;
        return [ctx, errors];
    }

    recalcIndex(ctx, index) {
        return findIndex(ctx.list, o => o.hasOtherName === true, index + 1);
    }

    nextStepUrl(req, ctx) {
        if (ctx.index === -1) {
            return this.next(req, ctx).getUrlWithContext(ctx);
        }
        return this.next(req, ctx).getUrlWithContext(ctx, ctx.index);
    }

    nextStepOptions(ctx) {
        ctx.continue = get(ctx, 'index', -1) !== -1;
        return {
            options: [
                {key: 'continue', value: true, choice: 'continue'},
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.index;
        delete ctx.currentName;
        delete ctx.continue;
        return [ctx, formdata];
    }

    isComplete(ctx) {
        const executorsWrapper = new ExecutorsWrapper(ctx);
        return [executorsWrapper.executorsWithAnotherName().every(exec => exec.currentName), 'inProgress'];
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.executorName && errors) {
            errors[0].msg = errors[0].msg.replace('{executorName}', fields.executorName.value);
        }
        return fields;
    }
}

module.exports = ExecutorCurrentName;
