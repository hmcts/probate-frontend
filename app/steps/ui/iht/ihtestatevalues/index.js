const ValidationStep = require('app/core/steps/ValidationStep');
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
        if (!IhtEstateValuesUtil.isPositiveInteger(ctx.estateGrossValueField)) {
            errors.push(FieldError('estateGrossValueField', 'invalidInteger', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }
        if (!IhtEstateValuesUtil.isPositiveInteger(ctx.estateNetValueField)) {
            errors.push(FieldError('estateNetValueField', 'invalidInteger', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }

        ctx.estateGrossValue = parseFloat(numeral(ctx.estateGrossValueField).format('0.00'));
        ctx.estateNetValue = parseFloat(numeral(ctx.estateNetValueField).format('0.00'));

        if (typeof ctx.estateNetQualifyingValueField === 'undefined' && ctx.estateNetQualifyingValue) {
            ctx.estateNetQualifyingValueField = '';
            ctx.estateNetQualifyingValue = 0.0;
        } else if (typeof ctx.estateNetQualifyingValueField !== 'undefined') {
            if (!IhtEstateValuesUtil.isPositiveInteger(ctx.estateNetQualifyingValueField)) {
                errors.push(FieldError('estateNetQualifyingValueField', 'invalidInteger', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            }
            ctx.estateNetQualifyingValue = parseFloat(numeral(ctx.estateNetQualifyingValueField).format('0.00'));
        }
        if (ctx.estateNetQualifyingValueField > ctx.estateGrossValueField || ctx.estateNetValue > ctx.estateGrossValueField) {
            errors.push(FieldError('estateNetValueField', 'netValueGreaterThanGross', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }
        return [ctx, errors];
    }
    isComplete(ctx) {
        const estateValuesFilled = ctx.estateGrossValueField !== 'undefined' &&
            ctx.estateGrossValueField !== null && typeof ctx.estateNetValueField !== 'undefined' &&
            ctx.estateNetValueField !== null && typeof ctx.estateNetQualifyingValueField !== 'undefined' &&
            ctx.estateNetQualifyingValueField !== null;
        return [
            (ctx.estateValueCompleted === 'optionNo' && estateValuesFilled) ||
            ctx.estateValueCompleted === 'optionYes' || typeof ctx.estateValueCompleted === 'undefined' ||
            (typeof ctx.ihtFormId !== 'undefined' && ctx.ihtFormId !== null), 'inProgress'
        ];
    }
}

module.exports = IhtEstateValues;
