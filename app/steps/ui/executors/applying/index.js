const ValidationStep = require('app/core/steps/ValidationStep');
const services = require('app/components/services');
const json = require('app/resources/en/translation/executors/applying.json');

module.exports = class ExecutorsApplying extends ValidationStep {

    static getUrl() {
        return '/other-executors-applying';
    }

    * handlePost(ctx) {
        if (ctx.invitesSent && json.optionNo) {
            yield ctx.list
                .filter(exec => exec.isApplying && !exec.isApplicant && exec.inviteId)
                .map(exec => {
                    return services.removeExecutor(exec.inviteId)
                        .then(result => {
                            if (result.name === 'Error') {
                                throw new Error('Error while deleting executor from invitedata table.');
                            }
                        });
                });
        }
        return [ctx];
    }

    nextStepOptions() {
        const nextStepOptions = {
            options: [
                {key: 'otherExecutorsApplying', value: json.optionYes, choice: 'otherExecutorsApplying'}
            ]
        };
        return nextStepOptions;
    }
};
