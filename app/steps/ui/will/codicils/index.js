'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const json = require('app/resources/en/translation/will/codicils.json');

module.exports = class WillCodicils extends ValidationStep {

    static getUrl() {
        return '/will-codicils';
    }

    nextStepUrl(ctx) {
        return this.next(ctx).constructor.getUrl('codicils');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'codicils', value: json.optionNo, choice: 'noCodicils'}
            ]
        };
    }

    action(ctx, formdata) {
        if (ctx.codicils === this.generateContent(ctx, formdata).optionNo) {
            delete ctx.codicilsNumber;
        }
        super.action(ctx, formdata);
        return [ctx, formdata];
    }
};
