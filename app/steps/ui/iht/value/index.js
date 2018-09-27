'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const validator = require('validator');
const numeral = require('numeral');
const FieldError = require('app/components/error');

module.exports = class IhtValue extends ValidationStep {

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
};
