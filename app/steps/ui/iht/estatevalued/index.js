'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class IhtEstateValued extends ValidationStep {

    static getUrl() {
        return '/estate-valued';
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'estateValueCompleted', value: 'optionYes', choice: 'ihtEstateFormsCompleted'}
            ]
        };
    }

}

module.exports = IhtEstateValued;
