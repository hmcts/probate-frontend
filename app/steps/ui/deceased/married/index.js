'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const WillWrapper = require('app/wrappers/Will');
const DeceasedWrapper = require('app/wrappers/Deceased');
const FeatureToggle = require('app/utils/FeatureToggle');

class DeceasedMarried extends ValidationStep {

    static getUrl() {
        return '/deceased-married';
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

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.isToggleEnabled = FeatureToggle.isEnabled(req.session.featureToggles, 'screening_questions');
        return ctx;
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

module.exports = DeceasedMarried;
