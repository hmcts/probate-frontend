'use strict';

const EligibilityValidationStep = require('app/core/steps/EligibilityValidationStep');
const pageUrl = '/mental-capacity';
const fieldKey = 'mentalCapacity';
const TaskList = require('app/steps/ui/tasklist');

class MentalCapacity extends EligibilityValidationStep {

    static getUrl() {
        return pageUrl;
    }

    getContextData(req, res) {
        return super.getContextData(req, res, pageUrl, fieldKey);
    }

    nextStepUrl(req, ctx) {
        if (!this.previousQuestionsAnswered(req, ctx, fieldKey)) {
            return TaskList.getUrl();
        }

        return this.next(req, ctx).constructor.getUrl('mentalCapacity');
    }

    nextStepOptions() {
        return {
            options: [
                {key: fieldKey, value: 'optionYes', choice: 'isCapable'}
            ]
        };
    }
}

module.exports = MentalCapacity;
