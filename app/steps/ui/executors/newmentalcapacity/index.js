'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const content = require('app/resources/en/translation/executors/mentalcapacity');

module.exports = class NewMentalCapacity extends ValidationStep {

    static getUrl() {
        return '/new-mental-capacity';
    }

    nextStepUrl(ctx) {
        return this.next(ctx).constructor.getUrl('mentalCapacity');
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
};
