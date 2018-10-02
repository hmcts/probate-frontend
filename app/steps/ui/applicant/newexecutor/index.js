'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const json = require('app/resources/en/translation/applicant/executor');

module.exports = class NewApplicantExecutor extends ValidationStep {

    static getUrl() {
        return '/new-applicant-executor';
    }

    nextStepUrl(ctx) {
        return this.next(ctx).constructor.getUrl('notExecutor');
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
};
