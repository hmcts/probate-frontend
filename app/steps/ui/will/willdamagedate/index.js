'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FieldError = require('app/components/error');
const FormatDate = require('app/utils/FormatDate');
const DateValidation = require('app/utils/DateValidation');
const moment = require('moment');
const config = require('config');

class WillDamageDate extends ValidationStep {

    static getUrl() {
        return '/will-damage-date';
    }

    handleGet(ctx) {
        if (ctx.willDamageDate) {
            [ctx['willdamagedate-day'], ctx['willdamagedate-month'], ctx['willdamagedate-year']] = FormatDate.formatDateGet(ctx.willDamageDate);
        }
        return [ctx];
    }

    handlePost(ctx, errors, formdata, session) {

        if (ctx.willDamageDateKnown === 'optionNo') {
            delete ctx['willdamagedate-day'];
            delete ctx['willdamagedate-month'];
            delete ctx['willdamagedate-year'];
            ctx.willDamageDate = '';
            return [ctx, errors];
        }

        const day = ctx['willdamagedate-day'] ? ctx['willdamagedate-day'] : '1';
        const month = ctx['willdamagedate-month'] ? ctx['willdamagedate-month'] : '1';
        const year = ctx['willdamagedate-year'];

        const willdamagedate = moment(`${day}/${month}/${year}`, config.dateFormat).parseZone();

        if (!year) {
            errors.push(FieldError('willdamagedate-year', 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            return [ctx, errors];
        } else if (ctx['willdamagedate-day'] && !ctx['willdamagedate-month']) {
            errors.push(FieldError('willdamagedate-month', 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            return [ctx, errors];
        } else if (willdamagedate.isAfter(moment())) {
            errors.push(FieldError('willdamagedate', 'future', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            return [ctx, errors];
        } else if (!willdamagedate.isValid() || !DateValidation.isPositive([day, month, year])) {
            errors.push(FieldError('willdamagedate', 'invalid', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            return [ctx, errors];
        }

        const d = ctx['willdamagedate-day'] ? ctx['willdamagedate-day'] : '';
        const m = ctx['willdamagedate-month'] ? ctx['willdamagedate-month'] : '';
        const y = ctx['willdamagedate-year'];
        const formattedDate = FormatDate.formatDatePost({'day': d, 'month': m, 'year': y});
        ctx.willDamageDate = formattedDate;

        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx['willdamagedate-day'];
        delete ctx['willdamagedate-month'];
        delete ctx['willdamagedate-year'];
        return [ctx, formdata];
    }
}

module.exports = WillDamageDate;
