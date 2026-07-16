'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class NewSubmittedToHmrc extends ValidationStep {

    static getUrl() {
        return '/new-submitted-to-hmrc';
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'estateValueCompleted', value: 'optionYes', choice: 'optionIHT400'},
            ]
        };
    }

    handlePost(ctx, errors) {
        if (ctx.estateValueCompleted === 'optionYes') {
            delete ctx.estateGrossValue;
            delete ctx.estateNetValue;
            delete ctx.estateNetQualifyingValue;
            delete ctx.estateNetQualifyingValueField;
            delete ctx.estateGrossValueField;
            delete ctx.estateNetValueField;
            ctx.ihtFormEstateId = 'optionIHT400';
        } else if (ctx.estateValueCompleted === 'optionNo') {
            delete ctx.ihtGrossValue;
            delete ctx.ihtNetValue;
            delete ctx.grossValueField;
            delete ctx.netValueField;
            delete ctx.hmrcLetterId;
            delete ctx.uniqueProbateCodeId;
        }
        return super.handlePost(ctx, errors);
    }
    isComplete(ctx) {
        const noIht400Required = ctx.estateValueCompleted === 'optionNo';
        const iht400RequiredAndCodeReceived = ctx.estateValueCompleted === 'optionYes' && ctx.hmrcLetterId === 'optionYes';
        return [
            noIht400Required || iht400RequiredAndCodeReceived, 'inProgress'
        ];
    }
}

module.exports = NewSubmittedToHmrc;
