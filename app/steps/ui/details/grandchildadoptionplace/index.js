'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class ChildAdoptionPlace extends ValidationStep {

    static getUrl() {
        return '/child-adoption-place';
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('adoptionNotEnglandOrWales');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'childAdoptionPlace', value: 'optionYes', choice: 'childAdoptedInEnglandOrWales'}
            ]
        };
    }
}

module.exports = ChildAdoptionPlace;
