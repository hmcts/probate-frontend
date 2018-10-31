'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FeatureToggle = require('app/utils/FeatureToggle');
const AliasData = require('app/utils/AliasData.js');

class ApplicantAlias extends ValidationStep {

    static getUrl() {
        return '/applicant-alias';
    }

    isComplete(ctx, formdata, featureToggles) {
        const isEnabled = FeatureToggle.isEnabled(featureToggles, 'main_applicant_alias');
        return [isEnabled ? this.validate(ctx, formdata)[0] : true, 'inProgress'];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        formdata = AliasData.aliasDataRequiredAfterDeclaration(ctx, formdata);
        return [ctx, formdata];
    }
}

module.exports = ApplicantAlias;
