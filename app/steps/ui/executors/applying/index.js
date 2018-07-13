const ValidationStep = require('app/core/steps/ValidationStep');
const json = require('app/resources/en/translation/executors/applying.json');
const ExecutorsWrapper = require('app/wrappers/Executors');

module.exports = class ExecutorsApplying extends ValidationStep {

    static getUrl() {
        return '/other-executors-applying';
    }

    nextStepOptions() {
        const nextStepOptions = {
            options: [
                {key: 'otherExecutorsApplying', value: json.optionYes, choice: 'otherExecutorsApplying'}
            ]
        };
        return nextStepOptions;
    }

    handlePost(ctx) {
        if (ctx.otherExecutorsApplying === 'No') {
            const executorsWrapper = new ExecutorsWrapper(ctx);
            executorsWrapper.executors(true)
                .map(executor => {
                    delete executor.isApplying;
                    return executor;
                });
        }
        return [ctx];
    }
};
