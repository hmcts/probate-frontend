'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const featureToggle = require('app/utils/FeatureToggle');

class CopiesUk extends ValidationStep {

    static getUrl() {
        return '/copies-uk';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.uk = ctx.uk ? parseInt(ctx.uk): ctx.uk;
        return ctx;
    }

    handleGet(ctx, formdata, featureToggles) {
        ctx.isFeesApiToggleEnabled = featureToggle.isEnabled(featureToggles, 'fees_api');

        return [ctx];
    }

    handlePost(ctx, errors) {
        ctx.uk = ctx.uk || 0;
        return [ctx, errors];
    }

    isComplete(ctx) {
        return [ctx.uk >= 0, 'inProgress'];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete formdata.applicant.addresses;
        delete formdata.deceased.addresses;
        return [ctx, formdata];
    }
}

module.exports = CopiesUk;
