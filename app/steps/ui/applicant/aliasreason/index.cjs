'use strict';

const ValidationStep = require('app/core/steps/ValidationStep.cjs');
const AliasData = require('app/utils/AliasData.cjs');

class ApplicantAliasReason extends ValidationStep {

    static getUrl() {
        return '/applicant-alias-reason';
    }

    handlePost(ctx, errors) {
        if (ctx.aliasReason !== 'optionOther') {
            delete ctx.otherReason;
        }
        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        formdata = AliasData.aliasDataRequiredAfterDeclaration(ctx, formdata);
        return [ctx, formdata];
    }
}

module.exports = ApplicantAliasReason;
