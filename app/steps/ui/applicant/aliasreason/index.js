'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const AliasData = require('app/utils/AliasData.js');
const content = require('app/resources/en/translation/applicant/aliasreason');

class ApplicantAliasReason extends ValidationStep {

    static getUrl() {
        return '/applicant-alias-reason';
    }

    handlePost(ctx, errors) {
        if (ctx.aliasReason !== content.optionOther.toLowerCase()) {
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
