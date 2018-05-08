const CollectionStep = require('app/core/steps/CollectionStep'),
    {get, some, findIndex} = require('lodash');

const path = '/executor-notified/';

module.exports = class ExecutorNotified extends CollectionStep {

    constructor(steps, section, templatePath, i18next, schema) {
        super(steps, section, templatePath, i18next, schema);
        this.path = path;
    }

    static getUrl(index = '*') {
        return path + index;
    }

    nextStepOptions(ctx) {
        ctx.nextExecutor = get(ctx, 'index', -1) !== -1;
        const nextStepOptions = {
            options: [
                {key: 'nextExecutor', value: true, choice: 'roles'},
            ]
        };
        return nextStepOptions;
    }

    * handlePost(ctx, errors, formdata) {
        formdata.executors.list[ctx.index].executorNotified = ctx.executorNotified;
        ctx.index = this.recalcIndex(ctx);
        return [ctx, errors];
    }

    * handleGet(ctx, formdata) {
        const currentExecutor = formdata.executors.list[ctx.index];
        ctx.executorNotified = currentExecutor.executorNotified;
        return [ctx];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.executorNotified;
        delete ctx.executorName;
        delete ctx.nextExecutor;
        return [ctx, formdata];
    }

    isSoftStop(formdata, ctx) {
        const execList = get(formdata, 'executors.list', []);
        const softStopForNotNotified = some(execList, exec => exec.executorNotified === this.generateContent(ctx, formdata).optionNo);

        return {
            'stepName': this.constructor.name,
            'isSoftStop': softStopForNotNotified
        };
    }

    recalcIndex(ctx) {
        return findIndex(ctx.list, exec => !exec.isDead && (ctx.otherExecutorsApplying === this.commonContent().no || !exec.isApplying), ctx.index + 1);
    }
};
