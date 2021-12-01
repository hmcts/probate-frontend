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
        if (ctx.estateValueCompleted === 'optionYes') {
            ctx.estateGrossValue = null;
            ctx.estateNetValue = null;
            ctx.estateGrossValueField = null;
            ctx.estateNetValueField = null;
            ctx.estateNetQualifyingValue = null;
            ctx.unusedAllowanceClaimed = null;
            ctx.deceasedHadLateSpouseOrCivilPartner = null;
            ctx.unusedAllowanceClaimed = null;

        }

        return ctx;
    }
}

module.exports = IhtEstateValued;
