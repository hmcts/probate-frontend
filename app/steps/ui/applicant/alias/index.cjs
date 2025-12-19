'use strict';

const ValidationStep = require('app/core/steps/ValidationStep.cjs');
const AliasData = require('app/utils/AliasData.cjs');

class ApplicantAlias extends ValidationStep {

    static getUrl() {
        return '/applicant-alias';
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        formdata = AliasData.aliasDataRequiredAfterDeclaration(ctx, formdata);
        return [ctx, formdata];
    }
}

module.exports = ApplicantAlias;
