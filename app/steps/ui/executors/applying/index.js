const ValidationStep = require('app/core/steps/ValidationStep');
const json = require('app/resources/en/translation/executors/applying.json');

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
};
