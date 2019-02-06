'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const json = require('app/resources/en/translation/iht/method');

class IhtMethod extends ValidationStep {

    static getUrl() {
        return '/iht-method';
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'method', value: json.onlineOption, choice: 'online'}
            ]
        };
    }
}

module.exports = IhtMethod;
