'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const featureToggle = require('app/utils/FeatureToggle');
const config = require('config');

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
        ctx.isFtFeesIncrease2025 = featureToggle.isEnabled(featureToggles, 'ft_probate_fee_increase_2025');
        ctx.copiesUKFee = ctx.isFtFeesIncrease2025 ? config.fee.copiesUKFee2025 : config.fee.copiesUKFee;
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
        if (formdata.applicant) {
            delete formdata.applicant.addresses;
        }
        if (formdata.deceased) {
            delete formdata.deceased.addresses;
        }
        if (formdata.executors) {
            formdata.executors.list.forEach((executor) => {
                delete executor.addresses;
            });
        }
        return [ctx, formdata];
    }
}

module.exports = CopiesUk;
