'use strict';
const ValidationStep = require('app/core/steps/ValidationStep');
const FeatureToggle = require('app/utils/FeatureToggle');

class ApplicantAlias extends ValidationStep {

    static getUrl() {
        return '/applicant-alias';
    }

    isComplete(ctx, formdata, featureToggles) {
        const isEnabled = FeatureToggle.isEnabled(featureToggles, 'main_applicant_alias');
        return [isEnabled ? this.validate()[0] : true, 'noProgress'];
    }
}

module.exports = ApplicantAlias;
