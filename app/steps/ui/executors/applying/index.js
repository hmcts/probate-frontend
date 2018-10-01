'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const ExecutorsWrapper = require('app/wrappers/Executors');
const json = require('app/resources/en/translation/executors/applying');

class ExecutorsApplying extends ValidationStep {

    static getUrl() {
        return '/other-executors-applying';
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

    nextStepOptions() {
        const nextStepOptions = {
            options: [
                {key: 'otherExecutorsApplying', value: json.optionYes, choice: 'otherExecutorsApplying'}
            ]
        };
        return nextStepOptions;
    }
}

module.exports = ExecutorsApplying;
