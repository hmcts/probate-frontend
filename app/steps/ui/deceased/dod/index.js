'use strict';

const DateStep = require('app/core/steps/DateStep');
const FieldError = require('app/components/error');
const FeatureToggle = require('app/utils/FeatureToggle');

class DeceasedDod extends DateStep {

    static getUrl() {
        return '/deceased-dod';
    }

    dateName() {
        return 'dod';
    }

    handlePost(ctx, errors, formdata, session) {
        let dob;
        if (session.form.deceased && session.form.deceased.dob_year && session.form.deceased.dob_month && session.form.deceased.dob_day) {
            dob = new Date(`${session.form.deceased.dob_year}-${session.form.deceased.dob_month}-${session.form.deceased.dob_day}`);
            dob.setHours(0, 0, 0, 0);
        }

        const dod = new Date(`${ctx.dod_year}-${ctx.dod_month}-${ctx.dod_day}`);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dod > today) {
            errors.push(FieldError('dod_date', 'dateInFuture', this.resourcePath, this.generateContent()));
        } else if (typeof dob === 'object' && dob >= dod) {
            errors.push(FieldError('dod_date', 'dodBeforeDob', this.resourcePath, this.generateContent()));
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

module.exports = DeceasedDod;
