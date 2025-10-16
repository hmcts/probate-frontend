'use strict';

const EligibilityValidationStep = require('app/core/steps/EligibilityValidationStep');
const pageUrl = '/ee-estate-valued';
const fieldKey = 'eeEstateValued';
const Dashboard = require('app/steps/ui/dashboard');

class ExceptedEstateValued extends EligibilityValidationStep {

    static getUrl() {
        return pageUrl;
    }

    getContextData(req, res) {
        return super.getContextData(req, res, pageUrl, fieldKey);
    }

    nextStepUrl(req, ctx) {
        if (!this.previousQuestionsAnswered(req, ctx, fieldKey)) {
            return Dashboard.getUrl();
        }

        return this.next(req, ctx).getUrlWithContext(ctx, 'eeEstateNotValued');
    }

    nextStepOptions() {
        return {
            options: [
                {key: fieldKey, value: 'optionYes', choice: 'eeEstateValued'}
            ]
        };
    }
}

module.exports = ExceptedEstateValued;
