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

    handlePost(ctx, errors, formdata, session) {
        let dod;
        if (session.form.deceased && session.form.deceased.dod_year && session.form.deceased.dod_month && session.form.deceased.dod_day) {
            dod = new Date(`${session.form.deceased.dod_year}-${session.form.deceased.dod_month}-${session.form.deceased.dod_day}`);
            dod.setHours(0, 0, 0, 0);
        }

        const dob = new Date(`${ctx.dob_year}-${ctx.dob_month}-${ctx.dob_day}`);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dob >= today) {
            errors.push(FieldError('dob_date', 'dateInFuture', this.resourcePath, this.generateContent()));
        } else if (dob >= dod) {
            errors.push(FieldError('dob_date', 'dodBeforeDob', this.resourcePath, this.generateContent()));
        }

        return [ctx, errors];
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

module.exports = DeceasedDob;
