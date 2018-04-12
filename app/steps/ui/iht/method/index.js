const ValidationStep = require('app/core/steps/ValidationStep'),
        json = require('app/resources/en/translation/iht/method.json');
module.exports = class IhtMethod extends ValidationStep {

    static getUrl() {
        return '/iht-method';
    }

    nextStepOptions() {
        const nextStepOptions = {
            options: [
                {key: 'method', value: json.onlineOption, choice: 'online'}
            ]
        };
        return nextStepOptions;
    }
};
