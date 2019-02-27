'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const validator = require('validator');
const numeral = require('numeral');
const FieldError = require('app/components/error');
const config = require('app/config');

class IhtValue extends ValidationStep {

    static getUrl() {
        return '/iht-value';
    }

    handlePost(ctx, errors) {
        ctx.grossValue = numeral(ctx.grossValueOnline).value();
        ctx.netValue = numeral(ctx.netValueOnline).value();

        if (!validator.isCurrency(ctx.grossValueOnline, {symbol: '£', allow_negatives: false})) {
            errors.push(FieldError('grossValueOnline', 'invalidCurrencyFormat', this.resourcePath, this.generateContent()));
        }

        if (!validator.isCurrency(ctx.netValueOnline, {symbol: '£', allow_negatives: false})) {
            errors.push(FieldError('netValueOnline', 'invalidCurrencyFormat', this.resourcePath, this.generateContent()));
        }

        if (ctx.netValue > ctx.grossValue) {
            errors.push(FieldError('netValueOnline', 'netValueGreaterThanGross', this.resourcePath, this.generateContent()));
        }

        ctx.grossValue = Math.floor(ctx.grossValue);
        ctx.netValue = Math.floor(ctx.netValue);

        return [ctx, errors];
    }

    nextStepOptions(ctx) {
        ctx.lessThanOrEqualTo250k = ctx.netValue <= config.assetsValueThreshold;

        return {
            options: [
                {key: 'lessThanOrEqualTo250k', value: true, choice: 'lessThanOrEqualTo250k'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.lessThanOrEqualTo250k;
        return [ctx, formdata];
    }

    clearFormData(ctx, sessionForm) {
        const fieldToCheckSection = 'iht';
        const fieldToCheck = 'netValue';

        if (ctx[fieldToCheck] > config.assetsValueThreshold) {
            const dataToClear = {
                assetsOutside: 'iht.assetsOutside',
                netValueAssetsOutsideField: 'iht.netValueAssetsOutsideField',
                netValueAssetsOutside: 'iht.netValueAssetsOutside'
            };

            return super.clearFormData(ctx, sessionForm, fieldToCheckSection, fieldToCheck, dataToClear);
        }

        return super.clearFormData(ctx, sessionForm);
    }
}

module.exports = IhtValue;
