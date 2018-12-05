'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FeatureToggle = require('app/utils/FeatureToggle');

class CodicilsNumber extends ValidationStep {

    static getUrl() {
        return '/codicils-number';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.codicilsNumber = ctx.codicilsNumber ? parseInt(ctx.codicilsNumber) : ctx.codicilsNumber;
        ctx.isToggleEnabled = FeatureToggle.isEnabled(req.session.featureToggles, 'screening_questions');
        return ctx;
    }

    handlePost(ctx, errors) {
        ctx.codicilsNumber = ctx.codicilsNumber || 0;
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
}

module.exports = CodicilsNumber;
