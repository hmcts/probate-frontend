'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class WillCodicils extends ValidationStep {

    static getUrl() {
        return '/will-codicils*';
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('codicils');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'codicils', value: 'optionNo', choice: 'noCodicils'}
            ]
        };
    }

    action(ctx, formdata) {
        if (ctx.codicils === 'optionNo') {
            delete ctx.codicilsNumber;
        }
        super.action(ctx, formdata);
        return [ctx, formdata];
    }
}

module.exports = WillCodicils;
