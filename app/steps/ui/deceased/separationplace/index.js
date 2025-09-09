'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class SeparationPlace extends ValidationStep {

    static getUrl() {
        return '/deceased-separation-place';
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('separationPlace');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'separationPlace', value: 'optionYes', choice: 'inEnglandOrWales'},
            ]
        };
    }
}

module.exports = SeparationPlace;
