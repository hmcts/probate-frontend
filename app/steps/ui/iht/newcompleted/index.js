'use strict';

const EligibilityValidationStep = require('app/core/steps/EligibilityValidationStep');
const content = require('app/resources/en/translation/iht/newcompleted');
const pageUrl = '/new-iht-completed';
const fieldKey = 'completed';

class NewIhtCompleted extends EligibilityValidationStep {

    static getUrl() {
        return pageUrl;
    }

    getContextData(req, res) {
        return super.getContextData(req, res, pageUrl, fieldKey);
    }

    nextStepUrl(ctx) {
        return this.next(ctx).constructor.getUrl('ihtNotCompleted');
    }

    nextStepOptions() {
        return {
            options: [
                {key: fieldKey, value: content.optionYes, choice: 'completed'}
            ]
        };
    }
}

module.exports = NewIhtCompleted;
