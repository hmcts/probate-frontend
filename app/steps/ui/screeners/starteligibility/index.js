'use strict';

const Step = require('app/core/steps/Step');
const featureToggle = require('app/utils/FeatureToggle');

class StartEligibility extends Step {

    static getUrl() {
        return '/start-eligibility';
    }

    handleGet(ctx, formdata, featureToggles) {
        ctx.isFeesApiToggleEnabled = featureToggle.isEnabled(featureToggles, 'ft_fees_api');

        return [ctx];
    }
}

module.exports = StartEligibility;
