'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FieldError = require('app/components/error');
const FormatDate = require('app/utils/FormatDate');
const DateValidation = require('app/utils/DateValidation');
const moment = require('moment');
const config = require('config');

class CodicilsDamageDate extends ValidationStep {

    static getUrl() {
        return '/codicils-damage-date';
    }

    handleGet(ctx) {
        if (ctx.codicilsDamageDate) {
            [ctx['codicilsdamagedate-day'], ctx['codicilsdamagedate-month'], ctx['codicilsdamagedate-year']] = FormatDate.formatDateGet(ctx.codicilsDamageDate);
        }
        return [ctx];
    }

    handlePost(ctx, errors, formdata, session) {

        if (ctx.codicilsDamageDateKnown === 'optionNo') {
            delete ctx['codicilsdamagedate-day'];
            delete ctx['codicilsdamagedate-month'];
            delete ctx['codicilsdamagedate-year'];
            ctx.codicilsDamageDate = '';
            return [ctx, errors];
        }

        const day = ctx['codicilsdamagedate-day'] ? ctx['codicilsdamagedate-day'] : '1';
        const month = ctx['codicilsdamagedate-month'] ? ctx['codicilsdamagedate-month'] : '1';
        const year = ctx['codicilsdamagedate-year'];

        const codicilsdamagedate = moment(`${day}/${month}/${year}`, config.dateFormat).parseZone();

        if (!year) {
            errors.push(FieldError('codicilsdamagedate-year', 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            return [ctx, errors];
        } else if (ctx['codicilsdamagedate-day'] && !ctx['codicilsdamagedate-month']) {
            errors.push(FieldError('codicilsdamagedate-month', 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            return [ctx, errors];
        } else if (codicilsdamagedate.isAfter(moment())) {
            errors.push(FieldError('codicilsdamagedate', 'future', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            return [ctx, errors];
        } else if (!codicilsdamagedate.isValid() || !DateValidation.isPositive([day, month, year])) {
            errors.push(FieldError('codicilsdamagedate', 'invalid', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            return [ctx, errors];
        }

        const d = ctx['codicilsdamagedate-day'] ? ctx['codicilsdamagedate-day'] : '';
        const m = ctx['codicilsdamagedate-month'] ? ctx['codicilsdamagedate-month'] : '';
        const y = ctx['codicilsdamagedate-year'];
        const formattedDate = FormatDate.formatDatePost({'day': d, 'month': m, 'year': y});
        ctx.codicilsDamageDate = formattedDate;

        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx['codicilsdamagedate-day'];
        delete ctx['codicilsdamagedate-month'];
        delete ctx['codicilsdamagedate-year'];
        return [ctx, formdata];
    }
}

module.exports = CodicilsDamageDate;
