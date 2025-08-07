'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class IhtEstateForm extends ValidationStep {

    static getUrl() {
        return '/estate-form';
    }
    nextStepOptions() {
        return {
            options: [
                {key: 'ihtFormId', value: 'optionIHT400', choice: 'optionIHT400'},
                {key: 'ihtFormId', value: 'optionIHT205', choice: 'optionIHT205'}
            ]
        };
    }
}

module.exports = IhtEstateForm;
