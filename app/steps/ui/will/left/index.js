'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const json = require('app/resources/en/translation/will/left');

class WillLeft extends ValidationStep {

    static getUrl() {
        return '/will-left';
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('noWill');
    }

    nextStepOptions() {
        const nextStepOptions = {
            options: [
                {key: 'left', value: json.optionYes, choice: 'withWill'}
            ]
        };
        return nextStepOptions;
    }
}

module.exports = WillLeft;
