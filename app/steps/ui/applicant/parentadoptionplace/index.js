'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class ParentAdoptionPlace extends ValidationStep {

    static getUrl() {
        return '/parent-adoption-place';
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('adoptionNotEnglandOrWales');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'parentAdoptionPlace', value: 'optionYes', choice: 'parentAdoptedInEnglandOrWales'}
            ]
        };
    }
}

module.exports = ParentAdoptionPlace;
