'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FieldError = require('app/components/error');
const FormatDate = require('app/utils/FormatDate');
const DateValidation = require('app/utils/DateValidation');
const moment = require('moment');
const FormatName = require('../../../../utils/FormatName');

class DivorceDate extends ValidationStep {

    static getUrl() {
        return '/deceased-divorce-date';
    }

    handleGet(ctx) {
        if (ctx.divorceDate) {
            [ctx['divorceDate-day'], ctx['divorceDate-month'], ctx['divorceDate-year']] = FormatDate.formatDateGet(ctx.divorceDate);
        }
        return [ctx];
    }
    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.deceasedName = FormatName.format(req.session.form.deceased);
        return ctx;
    }

    handlePost(ctx, errors, formdata, session) {

        if (ctx.divorceDateKnown === 'optionNo') {
            delete ctx['divorceDate-day'];
            delete ctx['divorceDate-month'];
            delete ctx['divorceDate-year'];
            ctx.divorceDate = '';
            return [ctx, errors];
        }

        const day = ctx['divorceDate-day'];
        const month = ctx['divorceDate-month'];
        const year = ctx['divorceDate-year'];

        const dateOutOfRange =
            (day && (day < 1 || day > 31)) ||
            (month && (month < 1 || month > 12)) ||
            (year && (year < 1000 || year > 9999));

        const DATE_FORMATS = ['D/M/YYYY', 'DD/MM/YYYY', 'D/MM/YYYY', 'DD/M/YYYY'];
        const divorceDate = moment(`${day}/${month}/${year}`, DATE_FORMATS, true).parseZone();

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
            errors.push(FieldError('divorceDate', 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        } else if (missingFields.length === 2) {
            errors.push(FieldError(`divorceDate-${missingFields.join('-')}`, 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        } else if (missingFields.length === 1) {
            errors.push(FieldError(`divorceDate-${missingFields[0]}`, 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        } else if (dateOutOfRange || !divorceDate.isValid() || !DateValidation.isPositive([day, month, year])) {
            errors.push(FieldError('divorceDate', 'invalid', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        } else if (divorceDate.isAfter(moment())) {
            errors.push(FieldError('divorceDate', 'future', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }
        const formattedDate = FormatDate.formatDatePost({'day': day, 'month': month, 'year': year});
        ctx.divorceDate = formattedDate;

        return [ctx, errors];
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.deceasedName && errors) {
            errors[0].msg = errors[0].msg.replace('{deceasedName}', fields.deceasedName.value);
        }
        return fields;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx['divorceDate-day'];
        delete ctx['divorceDate-month'];
        delete ctx['divorceDate-year'];
        return [ctx, formdata];
    }
}

module.exports = DivorceDate;
