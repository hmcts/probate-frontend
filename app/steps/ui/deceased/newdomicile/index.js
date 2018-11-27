'use strict';

const EligibilityValidationStep = require('app/core/steps/EligibilityValidationStep');
const content = require('app/resources/en/translation/deceased/newdomicile');
const pageUrl = '/new-deceased-domicile';
const fieldKey = 'domicile';

class NewDeceasedDomicile extends EligibilityValidationStep {

    static getUrl() {
        return pageUrl;
    }

    getContextData(req, res) {
        return super.getContextData(req, res, pageUrl, fieldKey);
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('notInEnglandOrWales');
    }

    nextStepOptions() {
        return {
            options: [
                {key: fieldKey, value: content.optionYes, choice: 'inEnglandOrWales'}
            ]
        };
    }
}

module.exports = NewDeceasedDomicile;
