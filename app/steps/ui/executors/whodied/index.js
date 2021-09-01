'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const {some} = require('lodash');

class ExecutorsWhoDied extends ValidationStep {

    static getUrl() {
        return '/executors-who-died*';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        if (ctx.list) {
            ctx.options = ctx.list
                .filter(o => !o.isApplicant)
                .map(o => ({value: o.fullName, text: o.fullName, checked: o.isDead === true}));
        }
        return ctx;
    }

    pruneFormData(executor) {
        if (executor.isDead) {
            delete executor.isApplying;
        }
        return executor;
    }

    handlePost(ctx, errors) {
        for (let i = 1; i < ctx.executorsNumber; i++) {
            ctx.list[i].isDead = ctx.executorsWhoDied.includes(ctx.list[i].fullName);
            ctx.list[i] = this.pruneFormData(ctx.list[i]);
        }
        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.options;
        delete ctx.executorsWhoDied;
        return [ctx, formdata];
    }

    isComplete(ctx) {
        return [some(ctx.list, exec => exec.isDead === true), 'inProgress'];
    }
}

module.exports = ExecutorsWhoDied;
