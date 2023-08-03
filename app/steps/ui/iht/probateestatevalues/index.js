'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const validator = require('validator');
const numeral = require('numeral');
const FieldError = require('app/components/error');
const IhtEstateForm = require('app/steps/ui/iht/estateform');

class ProbateEstateValues extends ValidationStep {

    static getUrl() {
        return '/probate-estate-values';
    }

    static getPreviousUrl() {
        return IhtEstateForm.getUrl();
    }

    handlePost(ctx, errors, formdata, session) {
        ctx.grossValue = parseFloat(numeral(ctx.grossValueField).format('0.00'));
        ctx.netValue = parseFloat(numeral(ctx.netValueField).format('0.00'));

        if (!validator.isCurrency(ctx.grossValueField, {symbol: '£', allow_negatives: false})) {
            errors.push(FieldError('grossValueField', 'invalidCurrencyFormat', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }

        if (!validator.isCurrency(ctx.netValueField, {symbol: '£', allow_negatives: false})) {
            errors.push(FieldError('netValueField', 'invalidCurrencyFormat', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }

        if (ctx.netValue > ctx.grossValue) {
            errors.push(FieldError('netValueField', 'netValueGreaterThanGross', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }

        return [ctx, errors];
    }
}

module.exports = ProbateEstateValues;
