const ValidationStep = require('app/core/steps/ValidationStep'),
    json = require('app/resources/en/translation/iht/completed.json'),
    {isEmpty} = require('lodash');

module.exports = class IhtCompleted extends ValidationStep {

    static getUrl() {
        return '/iht-completed';
    }

    nextStepUrl(ctx) {
        return this.next(ctx).constructor.getUrl('ihtNotCompleted');
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
};
