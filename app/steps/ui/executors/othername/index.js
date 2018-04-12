const ValidationStep = require('app/core/steps/ValidationStep');
const {some} = require('lodash');

module.exports = class ExecutorsWithOtherNames extends ValidationStep {

    static getUrl() {
        return '/executors-other-names';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        if (ctx.list) {
            ctx.options = ctx.list
            .filter(o => o.fullName)
            .filter (o => o.isApplying === true)
            .map(o => ({option: o.fullName, checked: o.hasOtherName === true}));
        }
        return ctx;
    }

    * handlePost(ctx, errors) {
        for (let i = 1; i < ctx.executorsNumber; i++) {
            ctx.list[i].hasOtherName  = ctx.executorsWithOtherNames.includes(ctx.list[i].fullName);
        }
        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.options;
        delete ctx.executorsWithOtherNames;
        return [ctx, formdata];
    }

    isComplete(ctx) {
        return [some((ctx.list), exec => exec.hasOtherName === true), 'inProgress'];
    }

};