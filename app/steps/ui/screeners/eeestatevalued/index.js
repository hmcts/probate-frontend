'use strict';

const EligibilityValidationStep = require('app/core/steps/EligibilityValidationStep');
const pageUrl = '/ee-estate-valued';
const fieldKey = 'eeEstateValued';
const Dashboard = require('app/steps/ui/dashboard');
const ExceptedEstateDeceasedDod = require('app/steps/ui/screeners/eedeceaseddod');

class ExceptedEstateValued extends EligibilityValidationStep {

    static getUrl() {
        return pageUrl;
    }

    static getPreviousUrl() {
        return ExceptedEstateDeceasedDod.getUrl();
    }

    getContextData(req, res) {
        return super.getContextData(req, res, pageUrl, fieldKey);
    }

    nextStepUrl(req, ctx) {
        if (!this.previousQuestionsAnswered(req, ctx, fieldKey)) {
            return Dashboard.getUrl();
        }

        return this.next(req, ctx).constructor.getUrl('eeEstateNotValued');
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
