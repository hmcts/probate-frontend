const ValidationStep = require('app/core/steps/ValidationStep'),
    json = require('app/resources/en/translation/will/left.json');
module.exports = class WillLeft extends ValidationStep {

    static getUrl() {
        return '/will-left';
    }

    nextStepUrl(ctx) {
        return this.next(ctx).constructor.getUrl('noWill');
    }

    nextStepOptions() {
        const nextStepOptions = {
            options: [
                {key: 'left', value: json.optionYes, choice: 'withWill'}
            ]
        };
        return nextStepOptions;
    }
};
