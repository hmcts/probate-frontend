'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FieldError = require('app/components/error');
const FormatDate = require('app/utils/FormatDate');
const DateValidation = require('app/utils/DateValidation');
const moment = require('moment');
const config = require('config');

class SeparationDate extends ValidationStep {

    static getUrl() {
        return '/deceased-separation-date';
    }

    handleGet(ctx) {
        if (ctx.separationDate) {
            [ctx['separation-day'], ctx['separation-month'], ctx['separation-year']] = FormatDate.formatDateGet(ctx.separationDate);
        }
        return [ctx];
    }

    handlePost(ctx, errors, formdata, session) {

        if (ctx.separationDateKnown === 'optionNo') {
            delete ctx['separation-day'];
            delete ctx['separation-month'];
            delete ctx['separation-year'];
            ctx.separationDate = '';
            return [ctx, errors];
        }

        const day = ctx['separation-day'];
        const month = ctx['separation-month'];
        const year = ctx['separation-year'];

        const separationDate = moment(`${day}/${month}/${year}`, config.dateFormat).parseZone();

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
            errors.push(FieldError('separationDate-day-month-year', 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            return [ctx, errors];
        } else if (missingFields.length === 2) {
            errors.push(FieldError(`separationDate-${missingFields.join('-')}`, 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            return [ctx, errors];
        } else if (missingFields.length === 1) {
            errors.push(FieldError(`separationDate-${missingFields[0]}`, 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            return [ctx, errors];
        } else if (separationDate.isAfter(moment())) {
            errors.push(FieldError('separationDate', 'future', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            return [ctx, errors];
        } else if (!separationDate.isValid() || !DateValidation.isPositive([day, month, year])) {
            errors.push(FieldError('separationDate', 'invalid', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            return [ctx, errors];
        }

        const d = ctx['separationDate-day'] ? ctx['separationDate-day'] : '';
        const m = ctx['separationDate-month'] ? ctx['separationDate-month'] : '';
        const y = ctx['separationDate-year'];
        const formattedDate = FormatDate.formatDatePost({'day': d, 'month': m, 'year': y});
        ctx.separationDate = formattedDate;

        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx['separationDate-day'];
        delete ctx['separationDate-month'];
        delete ctx['separationDate-year'];
        return [ctx, formdata];
    }
}

module.exports = SeparationDate;
