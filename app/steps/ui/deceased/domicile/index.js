'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const content = require('app/resources/en/translation/deceased/domicile');

module.exports = class DeceasedDomicile extends ValidationStep {

    static getUrl() {
        return '/deceased-domicile';
    }

    nextStepUrl(ctx) {
        return this.next(ctx).constructor.getUrl('notInEnglandOrWales');
    }

    nextStepOptions() {
        const nextStepOptions = {
            options: [
                {key: 'domicile', value: content.optionYes, choice: 'inEnglandOrWales'}
            ]
        };
        return nextStepOptions;
    }
};
