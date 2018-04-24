const ValidationStep = require('app/core/steps/ValidationStep');
const ExecutorsWrapper = require('app/wrappers/Executors');

module.exports = class ExecutorsWithOtherNames extends ValidationStep {

    static getUrl() {
        return '/executors-other-names';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.executorsWrapper = new ExecutorsWrapper(ctx);
        if (ctx.list) {
            ctx.options = ctx.executorsWrapper.executorsApplying(true)
                .map(o => ({option: o.fullName, checked: o.hasOtherName === true}));
        }
        return ctx;
    }

    * handlePost(ctx, errors) {
        for (let i = 1; i < ctx.executorsNumber; i++) {
            ctx.list[i].hasOtherName = ctx.executorsWithOtherNames.includes(ctx.list[i].fullName);
        }
        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.options;
        delete ctx.executorsWithOtherNames;
        delete ctx.executorsWrapper;
        return [ctx, formdata];
    }

    isComplete(ctx) {
        return [ctx.executorsWrapper.hasOtherName(), 'inProgress'];
    }
};
