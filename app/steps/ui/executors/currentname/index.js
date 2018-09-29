'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const {findIndex, get} = require('lodash');
const ExecutorsWrapper = require('app/wrappers/Executors');
const featureToggle = require('app/utils/FeatureToggle');

class ExecutorCurrentName extends ValidationStep {

    static getUrl(index = '*') {
        return `/executor-current-name/${index}`;
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const isToggleEnabled = featureToggle.isEnabled(req.session.featureToggles, 'main_applicant_alias');

        if (!isToggleEnabled) {
            if (req.params && !isNaN(req.params[0])) {
                ctx.index = parseInt(req.params[0]);
            } else if (req.params && req.params[0] === '*') {
                ctx.index = this.recalcIndex(ctx, ctx.index);
            }
        } else if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
        } else if (!ctx.index) {
            ctx.index = this.recalcIndex(ctx, 0);
        }
        return ctx;
    }

    handleGet(ctx) {
        if (ctx.list && ctx.list[ctx.index]) {
            ctx.currentName = ctx.list[ctx.index].currentName;
        }
        return [ctx];
    }

    handlePost(ctx, errors, formdata, session, hostname, featureToggles) {
        ctx.isToggleEnabled = featureToggle.isEnabled(featureToggles, 'main_applicant_alias');

        ctx.list[ctx.index].currentName = ctx.currentName;
        return [ctx, errors];
    }

    recalcIndex(ctx, index) {
        return findIndex(ctx.list, o => o.hasOtherName === true, index + 1);
    }

    nextStepOptions(ctx) {
        if (ctx.isToggleEnabled) {
            ctx.continue = get(ctx, 'index', -1) !== -1;
        } else {
            const nextExec = this.recalcIndex(ctx, ctx.index);
            ctx.continue = nextExec !==-1;
        }

        return {
            options: [
                {key: 'continue', value: true, choice: 'continue'},
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.currentName;
        delete ctx.continue;
        delete ctx.isToggleEnabled;
        return [ctx, formdata];
    }

    isComplete(ctx) {
        const executorsWrapper = new ExecutorsWrapper(ctx);
        return [executorsWrapper.executorsWithAnotherName().every(exec => exec.currentName), 'inProgress'];
    }
}

module.exports = ExecutorCurrentName;
