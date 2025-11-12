'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class GrandchildAdoptionPlace extends ValidationStep {

    static getUrl() {
        return '/grandchild-adoption-place';
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('adoptionNotEnglandOrWales');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'grandchildAdoptionPlace', value: 'optionYes', choice: 'grandchildAdoptedInEnglandOrWales'}
            ]
        };
    }
}

module.exports = GrandchildAdoptionPlace;
