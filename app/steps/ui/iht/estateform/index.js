'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class IhtEstateForm extends ValidationStep {

    static getUrl() {
        return '/estate-form';
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'estateForm', value: 'optionIHT207', choice: '207'}
            ]
        };
    }
}

module.exports = IhtEstateForm;
