'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FeatureToggle = require('app/utils/FeatureToggle');

class ApplicantAliasReason extends ValidationStep {

    static getUrl() {
        return '/applicant-alias-reason';
    }

    isComplete(ctx, formdata, featureToggles) {
        const isEnabled = FeatureToggle.isEnabled(featureToggles, 'main_applicant_alias');
        return [isEnabled ? this.validate(ctx, formdata)[0] : true, 'inProgress'];
    }
}

module.exports = ApplicantAliasReason;
