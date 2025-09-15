'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FieldError = require('app/components/error');
const FormatDate = require('app/utils/FormatDate');
const DateValidation = require('app/utils/DateValidation');
const moment = require('moment');
const FormatName = require('../../../../utils/FormatName');

class SeparationDate extends ValidationStep {

    static getUrl() {
        return '/deceased-separation-date';
    }

    handleGet(ctx) {
        if (ctx.separationDate) {
            [ctx['separationDate-day'], ctx['separationDate-month'], ctx['separationDate-year']] = FormatDate.formatDateGet(ctx.separationDate);
        }
        return [ctx];
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.deceasedName = FormatName.format(req.session.form.deceased);
        return ctx;
    }

    handlePost(ctx, errors, formdata, session) {

        if (ctx.separationDateKnown === 'optionNo') {
            delete ctx['separationDate-day'];
            delete ctx['separationDate-month'];
            delete ctx['separationDate-year'];
            ctx.separationDate = '';
            return [ctx, errors];
        }

        const day = ctx['separationDate-day'];
        const month = ctx['separationDate-month'];
        const year = ctx['separationDate-year'];

        const isDateOutOfRange =
            (day && (day < 1 || day > 31)) ||
            (month && (month < 1 || month > 12)) ||
            (year && (year < 1000 || year > 9999));

        const DATE_FORMATS = ['D/M/YYYY', 'DD/MM/YYYY', 'D/MM/YYYY', 'DD/M/YYYY'];
        const separationDate = moment(`${day}/${month}/${year}`, DATE_FORMATS, true).parseZone();

        const missingFields = [];
        if (!day) {
            missingFields.push('day');
        }
        if (!month) {
            missingFields.push('month');
        }
        if (!year) {
            missingFields.push('year');
        }

        if (missingFields.length === 3) {
            errors.push(FieldError('separationDate', 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            return [ctx, errors];
        } else if (missingFields.length === 2) {
            errors.push(FieldError(`separationDate-${missingFields.join('-')}`, 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            return [ctx, errors];
        } else if (missingFields.length === 1) {
            errors.push(FieldError(`separationDate-${missingFields[0]}`, 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            return [ctx, errors];
        } else if (isDateOutOfRange || !separationDate.isValid() || !DateValidation.isPositive([day, month, year])) {
            errors.push(FieldError('separationDate', 'invalid', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            return [ctx, errors];
        } else if (separationDate.isAfter(moment())) {
            errors.push(FieldError('separationDate', 'future', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            return [ctx, errors];
        }

        ctx.separationDate = FormatDate.formatDatePost({'day': day, 'month': month, 'year': year});

        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx['separationDate-day'];
        delete ctx['separationDate-month'];
        delete ctx['separationDate-year'];
        return [ctx, formdata];
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.deceasedName && errors) {
            errors[0].msg = errors[0].msg.replace('{deceasedName}', fields.deceasedName.value);
        }
        return fields;
    }
}

module.exports = SeparationDate;
