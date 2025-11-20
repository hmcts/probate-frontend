'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class DeceasedAdoptionPlace extends ValidationStep {

    static getUrl() {
        return '/deceased-adoption-place';
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('adoptionNotEnglandOrWales');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'deceasedAdoptionPlace', value: 'optionYes', choice: 'deceasedAdoptedInEnglandOrWales'}
            ]
        };
    }
}

module.exports = DeceasedAdoptionPlace;
