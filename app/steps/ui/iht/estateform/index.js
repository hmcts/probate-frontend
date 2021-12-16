'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class IhtEstateForm extends ValidationStep {

    static getUrl() {
        return '/estate-form';
    }

}

module.exports = IhtEstateForm;
