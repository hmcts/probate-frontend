'use strict';
const ValidationStep = require('app/core/steps/ValidationStep');

class ApplicantAliasReason extends ValidationStep {

    static getUrl() {
        return '/applicant-alias-reason';
    }

    handlePost(ctx, errors) {
        if (ctx.aliasReason !== 'other') {
            delete ctx.otherReason;
        }
        return [ctx, errors];
    }
}

module.exports = ApplicantAliasReason;
