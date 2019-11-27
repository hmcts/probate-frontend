'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const content = require('app/resources/en/translation/executors/allalive');

class ExecutorsAllAlive extends ValidationStep {

    static getUrl() {
        return '/executors-all-alive';
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl(1);
    }

    nextStepOptions() {
        const nextStepOptions = {
            options: [
                {key: 'allalive', value: content.optionYes, choice: 'isAlive'},
                {key: 'allalive', value: content.optionNo, choice: 'whoDied'}
            ]
        };
        return nextStepOptions;
    }

    action(ctx, formdata) {
        if (ctx.allalive === content.optionYes) {
            for (let i = 1; i < ctx.executorsNumber; i++) {
                if (ctx.list[i].isDead) {
                    ctx.list[i].isDead = false;
                    delete ctx.list[i].diedBefore;
                    delete ctx.list[i].notApplyingKey;
                    delete ctx.list[i].notApplyingReason;
                }

            }
        }

        super.action(ctx, formdata);
        return [ctx, formdata];
    }
}

module.exports = ExecutorsAllAlive;
