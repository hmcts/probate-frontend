'use strict';

const EligibilityValidationStep = require('app/core/steps/EligibilityValidationStep');
const content = require('app/resources/en/translation/screeners/otherapplicants');
const pageUrl = '/other-applicants';
const fieldKey = 'otherApplicants';

class OtherApplicants extends EligibilityValidationStep {

    static getUrl() {
        return pageUrl;
    }

    getContextData(req, res) {
        return super.getContextData(req, res, pageUrl, fieldKey);
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('otherApplicants');
    }

    nextStepOptions() {
        return {
            options: [
                {key: fieldKey, value: content.optionNo, choice: 'noOthers'}
            ]
        };
    }
}

module.exports = OtherApplicants;
