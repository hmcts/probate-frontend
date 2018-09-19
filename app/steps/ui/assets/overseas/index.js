'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const json = require('app/resources/en/translation/assets/overseas.json');

module.exports = class AssetsOverseas extends ValidationStep {

    static getUrl() {
        return '/assets-overseas';
    }

    nextStepOptions() {
        const nextStepOptions = {
            options: [
                {key: 'assetsoverseas', value: json.optionYes, choice: 'assetsoverseas'}
            ]
        };
        return nextStepOptions;
    }
};
