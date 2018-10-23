'use strict';

const DateStep = require('app/core/steps/DateStep');
const FieldError = require('app/components/error');

class DeceasedDob extends DateStep {

    static getUrl() {
        return '/deceased-dob';
    }

    dateName() {
        return 'dob';
    }

    handlePost(ctx, errors) {
        const dob = new Date(`${ctx.dob_year}-${ctx.dob_month}-${ctx.dob_day}`);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (today < dob) {
            errors.push(FieldError('dob_date', 'dateInFuture', this.resourcePath, this.generateContent()));
        }

        return [ctx, errors];
    }
}

module.exports = DeceasedDob;
