const ValidationStep = require('app/core/steps/ValidationStep'),
    json = require('app/resources/en/translation/will/original.json');

module.exports = class NewWillOriginal extends ValidationStep {

    static getUrl() {
        return '/new-will-original';
    }

    nextStepUrl(ctx) {
        return this.next(ctx).constructor.getUrl('notOriginal');
    }

    nextStepOptions() {
        const nextStepOptions = {
            options: [
                {key: 'original', value: json.optionYes, choice: 'isOriginal'}
            ]
        };
        return nextStepOptions;
    }
};
