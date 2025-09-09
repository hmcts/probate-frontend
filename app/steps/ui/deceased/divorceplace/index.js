'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class DivorcePlace extends ValidationStep {

    static getUrl() {
        return '/deceased-divorce-place';
    }
    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('divorcePlace');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'divorcePlace', value: 'optionYes', choice: 'inEnglandOrWales'},
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        return [ctx, formdata];
    }
}

module.exports = DivorcePlace;
