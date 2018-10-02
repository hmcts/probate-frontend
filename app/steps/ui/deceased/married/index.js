'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const WillWrapper = require('app/wrappers/Will');
const DeceasedWrapper = require('app/wrappers/Deceased');
const FeatureToggle = require('app/utils/FeatureToggle');

module.exports = class DeceasedMarried extends ValidationStep {

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

    handlePost(ctx, errors, formdata, session, hostname, featureToggles) {
        ctx.isToggleEnabled = FeatureToggle.isEnabled(featureToggles, 'screening_questions');

        return [ctx, errors];
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
