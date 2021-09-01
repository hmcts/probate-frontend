'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class ExecutorsAllAlive extends ValidationStep {

    static getUrl() {
        return '/executors-all-alive*';
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl(1);
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'allalive', value: 'optionYes', choice: 'isAlive'},
                {key: 'allalive', value: 'optionNo', choice: 'whoDied'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        if (ctx.allalive === 'optionYes') {
            for (let i = 1; i < ctx.executorsNumber; i++) {
                if (ctx.list[i].isDead) {
                    ctx.list[i].isDead = false;
                    delete ctx.list[i].diedBefore;
                    delete ctx.list[i].notApplyingKey;
                    delete ctx.list[i].notApplyingReason;
                }

            }
        }

        return [ctx, formdata];
    }
}

module.exports = ExecutorsAllAlive;
