'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const json = require('app/resources/en/translation/applicant/executor');

class ApplicantExecutor extends ValidationStep {

    static getUrl() {
        return '/applicant-executor';
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('notExecutor');
    }

    handlePost(ctx, errors) {
        if (ctx.executor === json.optionNo) {
            super.setHardStop(ctx, 'notExecutor');
        }
        return [ctx, errors];
    }

    nextStepOptions() {
        const nextStepOptions = {
            options: [
                {key: 'executor', value: json.optionYes, choice: 'isExecutor'}
            ]
        };
        return nextStepOptions;
    }
}

module.exports = ApplicantExecutor;
