const ValidationStep = require('app/core/steps/ValidationStep');
const validator = require('validator');
const numeral = require('numeral');
const FieldError = require('app/components/error');
const IhtEstateValuesUtil = require('app/utils/IhtEstateValuesUtil');

class IhtEstateValues extends ValidationStep {
    static getUrl() {
        return '/iht-estate-values';
    }

    nextStepOptions(ctx) {
        ctx.netQualifyingValueWithinRange = IhtEstateValuesUtil.withinRange(typeof ctx.estateNetQualifyingValue === 'undefined' ? 0 : ctx.estateNetQualifyingValue);

        return {
            options: [
                {key: 'netQualifyingValueWithinRange', value: true, choice: 'netQualifyingValueWithinRange'}
            ]
        };
    }

    handlePost(ctx, errors, formdata, session) {
        ctx.estateGrossValue = parseFloat(numeral(ctx.estateGrossValueField).format('0.00'));
        ctx.estateNetValue = parseFloat(numeral(ctx.estateNetValueField).format('0.00'));

        if (typeof ctx.estateNetQualifyingValueField === 'undefined' && ctx.estateNetQualifyingValue) {
            ctx.estateNetQualifyingValueField = '';
            ctx.estateNetQualifyingValue = 0.0;
        } else if (typeof ctx.estateNetQualifyingValueField !== 'undefined') {
            ctx.estateNetQualifyingValue = parseFloat(numeral(ctx.estateNetQualifyingValueField).format('0.00'));
            if (!validator.isCurrency(ctx.estateNetQualifyingValueField, {symbol: '£', allow_negatives: false})) {
                errors.push(FieldError('estateNetQualifyingValueField', 'invalidCurrencyFormat', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            }
        }

        if (!validator.isCurrency(ctx.estateGrossValueField, {symbol: '£', allow_negatives: false})) {
            errors.push(FieldError('estateGrossValueField', 'invalidCurrencyFormat', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }

        if (!validator.isCurrency(ctx.estateNetValueField, {symbol: '£', allow_negatives: false})) {
            errors.push(FieldError('estateNetValueField', 'invalidCurrencyFormat', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }

        if (ctx.estateNetValue > ctx.estateGrossValue) {
            errors.push(FieldError('estateNetValueField', 'netValueGreaterThanGross', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }

        return [ctx, errors];
    }
}

module.exports = IhtEstateValues;
