'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const content = require('app/resources/en/translation/deceased/newdomicile');
const EligibilityCookie = require('app/utils/EligibilityCookie');
const eligibilityCookie = new EligibilityCookie();

class NewDeceasedDomicile extends ValidationStep {

    static getUrl() {
        return '/new-deceased-domicile';
    }

    nextStepUrl(ctx) {
        return this.next(ctx).constructor.getUrl('notInEnglandOrWales');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'domicile', value: content.optionYes, choice: 'inEnglandOrWales'}
            ]
        };
    }

    setEligibilityCookie(req, res, nextStepUrl) {
        eligibilityCookie.setCookie(req, res, nextStepUrl);
    }
}

module.exports = NewDeceasedDomicile;
