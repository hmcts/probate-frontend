'use strict';

const DateStep = require('app/core/steps/DateStep');
const FieldError = require('app/components/error');
const FormatName = require('../../../../utils/FormatName');
const DateValidation = require('../../../../utils/DateValidation');

class DeceasedDob extends DateStep {

    static getUrl() {
        return '/deceased-dob';
    }

    dateName() {
        return ['dob'];
    }

    // eslint-disable-next-line complexity
    handlePost(ctx, errors, formdata, session) {
        let dod;
        if (session.form.deceased && session.form.deceased['dod-year'] && session.form.deceased['dod-month'] && session.form.deceased['dod-day']) {
            dod = new Date(`${session.form.deceased['dod-year']}-${session.form.deceased['dod-month']}-${session.form.deceased['dod-day']}`);
            dod.setHours(0, 0, 0, 0);
        }
        const day = ctx['dob-day'];
        const month = ctx['dob-month'];
        const year = ctx['dob-year'];
        const dob = new Date(`${year}-${month}-${day}`);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const missingFields = ['day', 'month', 'year'].filter(f => typeof ctx[`dob-${f}`] === 'undefined' || ctx[`dob-${f}`] === null || ctx[`dob-${f}`] === '');
        const isDobDateOutOfRange =
            (day && (day < 1 || day > 31)) ||
            (month && (month < 1 || month > 12)) ||
            (year && (year < 1000 || year > 9999));
        const isNonNumeric = isNaN(Number(day)) || isNaN(Number(month)) || isNaN(Number(year));

        if (missingFields.length === 2) {
            errors.push(FieldError(`dob-${missingFields.join('-')}`, 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        } else if (missingFields.length === 1) {
            errors.push(FieldError(`dob-${missingFields[0]}`, 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        } else if (isNonNumeric || isDobDateOutOfRange || isNaN(dob.getTime()) || !DateValidation.isPositive([day, month, year])) {
            errors.push(FieldError('dob-date', 'invalid', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        } else if (dob >= today) {
            errors.push(FieldError('dob-date', 'dateInFuture', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        } else if (dob > dod) {
            errors.push(FieldError('dob-date', 'dodBeforeDob', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }
        return [ctx, errors];
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.deceasedName = FormatName.format(req.session.form.deceased);
        return ctx;
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.deceasedName && errors) {
            errors[0].msg = errors[0].msg.replace('{deceasedName}', fields.deceasedName.value);
        }
        return fields;
    }
}

module.exports = DeceasedDob;
