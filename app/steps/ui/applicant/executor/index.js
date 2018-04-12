const ValidationStep = require('app/core/steps/ValidationStep'),
    json = require('app/resources/en/translation/applicant/executor.json');
module.exports = class ApplicantExecutor extends ValidationStep {

    static getUrl() {
        return '/applicant-executor';
    }

    nextStepUrl(ctx) {
        return this.next(ctx).constructor.getUrl('notExecutor');
    }

    * handlePost(ctx, errors) {
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
