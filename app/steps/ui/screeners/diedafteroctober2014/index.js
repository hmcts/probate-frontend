'use strict';

const EligibilityValidationStep = require('app/core/steps/EligibilityValidationStep');
const content = require('app/resources/en/translation/screeners/diedafteroctober2014');
const pageUrl = '/died-after-october-2014';
const fieldKey = 'diedAfter';

class DiedAfterOctober2014 extends EligibilityValidationStep {

    static getUrl() {
        return pageUrl;
    }

    getContextData(req, res) {
        return super.getContextData(req, res, pageUrl, fieldKey);
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('notDiedAfterOctober2014');
    }

    nextStepOptions() {
        return {
            options: [
                {key: fieldKey, value: content.optionYes, choice: 'diedAfter'}
            ]
        };
    }
}

module.exports = DiedAfterOctober2014;
