'use strict';

const DateStep = require('app/core/steps/DateStep');
const FieldError = require('app/components/error');
const FeatureToggle = require('app/utils/FeatureToggle');

class DeceasedDob extends DateStep {

    static getUrl() {
        return '/deceased-dob';
    }

    dateName() {
        return 'dob';
    }

    handlePost(ctx, errors, formdata, session, hostname, featureToggles) {
        const dob = new Date(`${ctx.dob_year}-${ctx.dob_month}-${ctx.dob_day}'`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (today < dob) {
            errors.push(FieldError('dob_date', 'dateInFuture', this.resourcePath, this.generateContent()));
        }

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
}

module.exports = DeceasedDob;
