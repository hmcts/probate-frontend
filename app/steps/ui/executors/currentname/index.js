const CollectionStep = require('app/core/steps/CollectionStep');
const {findIndex, every, get} = require('lodash');

const path = '/executor-current-name/';

module.exports = class ExecutorCurrentName extends CollectionStep {

    constructor(steps, section, templatePath, i18next, schema) {
        super(steps, section, templatePath, i18next, schema);
        this.path = path;
    }

    static getUrl(index = '*') {
        return path + index;
    }

    * handleGet(ctx) {
        if (ctx.list && ctx.list[ctx.index]) {
            ctx.currentName = ctx.list[ctx.index].currentName;
        }
        return [ctx];
    }

    * handlePost(ctx, errors) {
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
        return [every(ctx.list.filter(exec => exec.hasOtherName === true), exec => exec.currentName), 'inProgress'];
    }

};
