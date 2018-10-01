'use strict';

const CollectionStep = require('app/core/steps/CollectionStep');
const {findIndex, get} = require('lodash');
const ExecutorsWrapper = require('app/wrappers/Executors');
const path = '/executor-current-name/';

class ExecutorCurrentName extends CollectionStep {

    constructor(steps, section, templatePath, i18next, schema) {
        super(steps, section, templatePath, i18next, schema);
        this.path = path;
    }

    static getUrl(index = '*') {
        return path + index;
    }

    handleGet(ctx) {
        if (ctx.list && ctx.list[ctx.index]) {
            ctx.currentName = ctx.list[ctx.index].currentName;
        }
        return [ctx];
    }

    handlePost(ctx, errors) {
        ctx.list[ctx.index].currentName = ctx.currentName;
        ctx.index = this.recalcIndex(ctx, ctx.index);
        return [ctx, errors];
    }

    recalcIndex(ctx, index) {
        return findIndex(ctx.list, o => o.hasOtherName === true, index + 1);
    }

    nextStepOptions(ctx) {
        ctx.continue = get(ctx, 'index', -1) !== -1;
        const nextStepOptions = {
            options: [
                {key: 'continue', value: true, choice: 'continue'},
            ]
        };
        return nextStepOptions;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.currentName;
        delete ctx.continue;
        return [ctx, formdata];
    }

    isComplete(ctx) {
        const executorsWrapper = new ExecutorsWrapper(ctx);
        return [executorsWrapper.executorsWithAnotherName().every(exec => exec.currentName), 'inProgress'];
    }
}

module.exports = ExecutorCurrentName;
