'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FeatureToggle = require('app/utils/FeatureToggle');

module.exports = class CodicilsNumber extends ValidationStep {

    static getUrl() {
        return '/codicils-number';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.codicilsNumber = ctx.codicilsNumber ? parseInt(ctx.codicilsNumber): ctx.codicilsNumber;
        return ctx;
    }

    handlePost(ctx, errors, formdata, session, hostname, featureToggles) {
        ctx.codicilsNumber = ctx.codicilsNumber || 0;
        ctx.isToggleEnabled = FeatureToggle.isEnabled(featureToggles, 'screening_questions');

        return [ctx, errors];
    }

    isComplete(ctx) {
        return [ctx.codicilsNumber >= 0, 'inProgress'];
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'isToggleEnabled', value: true, choice: 'toggleOn'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.isToggleEnabled;
        return [ctx, formdata];
    }
};
