'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const featureToggle = require('app/utils/FeatureToggle');

class CopiesOverseas extends ValidationStep {

    static getUrl() {
        return '/copies-overseas*';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.overseas = ctx.overseas ? parseInt(ctx.overseas): ctx.overseas;
        return ctx;
    }

    handleGet(ctx, formdata, featureToggles) {
        ctx.isFeesApiToggleEnabled = featureToggle.isEnabled(featureToggles, 'ft_fees_api');

        return [ctx];
    }

    handlePost(ctx, errors) {
        ctx.overseas = ctx.overseas || 0;
        return [ctx, errors];
    }

    isComplete(ctx) {
        return [ctx.overseas >= 0, 'inProgress'];
    }
}

module.exports = CopiesOverseas;
