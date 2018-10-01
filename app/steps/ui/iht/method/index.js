'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const json = require('app/resources/en/translation/iht/method');

class IhtMethod extends ValidationStep {

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
}

module.exports = IhtMethod;
