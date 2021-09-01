'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const ExecutorsWrapper = require('app/wrappers/Executors');

class ExecutorsApplying extends ValidationStep {

    static getUrl() {
        return '/other-executors-applying*';
    }

    handlePost(ctx) {
        if (ctx.otherExecutorsApplying === 'optionNo') {
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
        return {
            options: [
                {key: 'otherExecutorsApplying', value: 'optionYes', choice: 'otherExecutorsApplying'}
            ]
        };
    }
}

module.exports = ExecutorsApplying;
