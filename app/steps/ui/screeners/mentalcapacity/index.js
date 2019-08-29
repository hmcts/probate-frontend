'use strict';

const EligibilityValidationStep = require('app/core/steps/EligibilityValidationStep');
const content = require('app/resources/en/translation/screeners/mentalcapacity');
const pageUrl = '/mental-capacity';
const fieldKey = 'mentalCapacity';

class MentalCapacity extends EligibilityValidationStep {

    static getUrl() {
        return pageUrl;
    }

    getContextData(req, res) {
        return super.getContextData(req, res, pageUrl, fieldKey);
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('mentalCapacity');
    }

    nextStepOptions() {
        return {
            options: [
                {key: fieldKey, value: content.optionYes, choice: 'isCapable'}
            ]
        };
    }
}

module.exports = MentalCapacity;
