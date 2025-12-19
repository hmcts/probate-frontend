'use strict';

const ValidationStep = require('app/core/steps/ValidationStep.cjs');
const WillWrapper = require('app/wrappers/Will.cjs');
const DeceasedWrapper = require('app/wrappers/Deceased.cjs');
const JourneyMap = require('app/core/JourneyMap.cjs');
const featureToggle = require('app/utils/FeatureToggle.cjs');

class DeceasedMarried extends ValidationStep {

    static getUrl() {
        return '/deceased-married';
    }

    next(req, ctx) {
        const journeyMap = new JourneyMap(req.session.journey);
        if (featureToggle.isEnabled(req.session.featureToggles, 'ft_will_condition')) {
            return journeyMap.nextStep(this, ctx);
        }

        return journeyMap.getNextStepByName('WillCodicils');
    }

    isSoftStop(formdata) {
        const softStopForMarriedAfterWill = (new DeceasedWrapper(formdata.deceased)).isMarried();
        return {
            'stepName': this.constructor.name,
            'isSoftStop': softStopForMarriedAfterWill
        };
    }

    handleGet(ctx, formdata) {
        ctx.codicilPresent = (new WillWrapper(formdata.will)).hasCodicils();
        return [ctx];
    }
}

module.exports = DeceasedMarried;
