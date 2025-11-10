'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class SiblingAdoptionPlace extends ValidationStep {

    static getUrl() {
        return '/sibling-adoption-place';
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('adoptionNotEnglandOrWales');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'siblingAdoptionPlace', value: 'optionYes', choice: 'siblingAdoptedInEnglandOrWales'}
            ]
        };
    }
}

module.exports = SiblingAdoptionPlace;
