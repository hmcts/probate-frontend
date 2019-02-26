'use strict';
const ValidationStep = require('app/core/steps/ValidationStep');
const content = require('app/resources/en/translation/applicant/adoptionplace');

class AdoptionPlace extends ValidationStep {

    static getUrl() {
        return '/adoption-place';
    }

    nextStepUrl(ctx) {
        return this.next(ctx).constructor.getUrl('adoptionNotEnglandOrWales');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'adoptionPlace', value: content.optionYes, choice: 'inEnglandOrWales'}
            ]
        };
    }
}

module.exports = AdoptionPlace;
