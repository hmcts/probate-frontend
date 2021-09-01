'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const ExecutorsWrapper = require('app/wrappers/Executors');

class ExecutorsWithOtherNames extends ValidationStep {

    static getUrl() {
        return '/executors-other-names*';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.executorsWrapper = new ExecutorsWrapper(ctx);
        if (ctx.list) {
            ctx.options = ctx.executorsWrapper.executorsApplying(true).map(o => {
                return {value: o.fullName, text: o.fullName, checked: o.hasOtherName === true};
            });
        }
        return ctx;
    }

    handlePost(ctx, errors) {
        for (let i = 1; i < ctx.executorsNumber; i++) {
            ctx.list[i].hasOtherName = ctx.executorsWithOtherNames.includes(ctx.list[i].fullName);
            ctx.list[i] = this.pruneFormData(ctx.list[i]);
        }
        return [ctx, errors];
    }

    pruneFormData(data) {
        if (!data.hasOtherName) {
            delete data.currentNameReason;
            delete data.currentName;
            delete data.otherReason;
        }
        return data;
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
}

module.exports = ExecutorsWithOtherNames;
