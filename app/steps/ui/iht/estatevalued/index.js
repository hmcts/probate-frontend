'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class IhtEstateValued extends ValidationStep {

    static getUrl() {
        return '/estate-valued';
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'estateValueCompleted', value: 'optionYes', choice: 'ihtEstateFormsCompleted'}
            ]
        };
    }

    handlePost(ctx) {
        ctx = this.resetValues(ctx);
        return [ctx];
    }

    resetValues(ctx) {
        if (ctx.estateValueCompleted) {
            ctx.deceasedHadLateSpouseOrCivilPartner = '';
            ctx.unusedAllowanceClaimed = '';
        }

        return ctx;
    }

}

module.exports = IhtEstateValued;
