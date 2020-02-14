'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class ExecutorsAllAlive extends ValidationStep {

    static getUrl() {
        return '/executors-all-alive';
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl(1);
    }

    handlePost(ctx, errors, formdata, session) {
        if (ctx.allalive === this.commonContent(session.language).yes) {
            for (let i = 1; i < ctx.executorsNumber; i++) {
                if (ctx.list[i].isDead) {
                    ctx.list[i].isDead = false;
                    delete ctx.list[i].diedBefore;
                    delete ctx.list[i].notApplyingKey;
                    delete ctx.list[i].notApplyingReason;
                }

            }
        }
        return [ctx, errors];
    }

    nextStepOptions() {
        const nextStepOptions = {
            options: [
                {key: 'allalive', value: 'optionYes', choice: 'isAlive'},
                {key: 'allalive', value: 'optionNo', choice: 'whoDied'}
            ]
        };
        return nextStepOptions;
    }
}

module.exports = ExecutorsAllAlive;
