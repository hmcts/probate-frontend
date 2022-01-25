'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const JourneyMap = require('app/core/JourneyMap');
const featureToggle = require('app/utils/FeatureToggle');

class CodicilsNumber extends ValidationStep {

    static getUrl() {
        return '/codicils-number';
    }

    next(req, ctx) {
        const journeyMap = new JourneyMap(req.session.journey);
        if (featureToggle.isEnabled(req.session.featureToggles, 'ft_will_condition')) {
            return journeyMap.nextStep(this, ctx);
        }

        return journeyMap.getNextStepByName('TaskList');
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.codicilsNumber = ctx.codicilsNumber ? parseInt(ctx.codicilsNumber) : ctx.codicilsNumber;
        return ctx;
    }

    handlePost(ctx, errors) {
        ctx.codicilsNumber = ctx.codicilsNumber || 0;
        return [ctx, errors];
    }

    isComplete(ctx) {
        return [ctx.codicilsNumber >= 0, 'inProgress'];
    }
}

module.exports = CodicilsNumber;
