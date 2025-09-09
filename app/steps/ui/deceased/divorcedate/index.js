'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FieldError = require('app/components/error');
const FormatDate = require('app/utils/FormatDate');
const DateValidation = require('app/utils/DateValidation');
const moment = require('moment');
const config = require('config');

class DivorceDate extends ValidationStep {

    static getUrl() {
        return '/deceased-divorce-date';
    }

    handleGet(ctx) {
        if (ctx.divorceDate) {
            [ctx['divorce-day'], ctx['divorce-month'], ctx['divorce-year']] = FormatDate.formatDateGet(ctx.divorceDate);
        }
        return [ctx];
    }

    handlePost(ctx, errors, formdata, session) {

        if (ctx.divorceDateKnown === 'optionNo') {
            delete ctx['divorce-day'];
            delete ctx['divorce-month'];
            delete ctx['divorce-year'];
            ctx.divorceDate = '';
            return [ctx, errors];
        }

        const day = ctx['divorce-day'];
        const month = ctx['divorce-month'];
        const year = ctx['divorce-year'];

        const divorceDate = moment(`${day}/${month}/${year}`, config.dateFormat).parseZone();

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
            errors.push(FieldError('divorceDate-day-month-year', 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            return [ctx, errors];
        } else if (missingFields.length === 2) {
            errors.push(FieldError(`divorceDate-${missingFields.join('-')}`, 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            return [ctx, errors];
        } else if (missingFields.length === 1) {
            errors.push(FieldError(`divorceDate-${missingFields[0]}`, 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            return [ctx, errors];
        } else if (divorceDate.isAfter(moment())) {
            errors.push(FieldError('divorceDate', 'future', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            return [ctx, errors];
        } else if (!divorceDate.isValid() || !DateValidation.isPositive([day, month, year])) {
            errors.push(FieldError('divorceDate', 'invalid', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            return [ctx, errors];
        }

        const d = ctx['divorceDate-day'] ? ctx['divorceDate-day'] : '';
        const m = ctx['divorceDate-month'] ? ctx['divorceDate-month'] : '';
        const y = ctx['divorceDate-year'];
        const formattedDate = FormatDate.formatDatePost({'day': d, 'month': m, 'year': y});
        ctx.divorceDate = formattedDate;

        return [ctx, errors];
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
