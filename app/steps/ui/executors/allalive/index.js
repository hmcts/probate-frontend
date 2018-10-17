'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const json = require('app/resources/en/translation/executors/allalive');

class ExecutorsAllAlive extends ValidationStep {

    static getUrl() {
        return '/executors-all-alive';
    }

    nextStepUrl(ctx) {
        return this.next(ctx).constructor.getUrl(1);
    }

    handlePost(ctx, errors) {
        if (ctx.allalive === this.commonContent().yes) {
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
                {key: 'allalive', value: json.optionYes, choice: 'isAlive'},
                {key: 'allalive', value: json.optionNo, choice: 'whoDied'}
            ]
        };
        return nextStepOptions;
    }
}

module.exports = ExecutorsAllAlive;
