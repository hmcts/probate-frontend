'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const json = require('app/resources/en/translation/iht/completed');
const {isEmpty} = require('lodash');

class IhtCompleted extends ValidationStep {

    static getUrl() {
        return '/iht-completed';
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('ihtNotCompleted');
    }

    nextStepOptions() {
        const nextStepOptions = {
            options: [
                {key: 'completed', value: json.optionYes, choice: 'completed'}
            ]
        };
        return nextStepOptions;
    }
    isComplete(ctx) {
        return [!isEmpty(ctx.completed), 'inProgress'];
    }
}

module.exports = IhtCompleted;
