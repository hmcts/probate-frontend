'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const content = require('app/resources/en/translation/executors/mentalcapacity');

class MentalCapacity extends ValidationStep {

    static getUrl() {
        return '/mental-capacity';
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('mentalCapacity');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'mentalCapacity', value: content.optionYes, choice: 'isCapable'}
            ]
        };
    }

    isComplete(ctx) {
        return [ctx.mentalCapacity === content.optionYes, 'inProgress'];
    }
}

module.exports = MentalCapacity;
