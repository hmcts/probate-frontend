'use strict';

const DateStep = require('app/core/steps/DateStep');
const FieldError = require('app/components/error');

class DeceasedDod extends DateStep {

    static getUrl() {
        return '/deceased-dod';
    }

    dateName() {
        return 'dod';
    }

    handlePost(ctx, errors, formdata, session) {
        const dob = new Date(`${session.form.deceased.dob_year}-${session.form.deceased.dob_month}-${session.form.deceased.dob_day}`);
        dob.setHours(0, 0, 0, 0);

        const dod = new Date(`${ctx.dod_year}-${ctx.dod_month}-${ctx.dod_day}`);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (today < dod) {
            errors.push(FieldError('dod_date', 'dateInFuture', this.resourcePath, this.generateContent()));
        } else if (dod < dob) {
            errors.push(FieldError('dod_date', 'dodBeforeDob', this.resourcePath, this.generateContent()));
        }

        return [ctx, errors];
    }
}

module.exports = DeceasedDod;
