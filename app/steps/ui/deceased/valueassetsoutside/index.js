'use strict';
const ValidationStep = require('app/core/steps/ValidationStep');
const validator = require('validator');
const numeral = require('numeral');
const FieldError = require('app/components/error');

class ValueAssetsOutside extends ValidationStep {

    static getUrl() {
        return '/value-assets-outside-england-wales';
    }

    handlePost(ctx, errors) {
        if (!validator.isCurrency(ctx.netValueAssetsOutside, {symbol: '£', allow_negatives: false})) {
            errors.push(FieldError('netValueAssetsOutside', 'invalidCurrencyFormat', this.resourcePath, this.generateContent()));
        }

        ctx.netValueAssetsOutside = numeral(ctx.netValueAssetsOutside).value();
        ctx.netValueAssetsOutside = Math.floor(ctx.netValueAssetsOutside);

        return [ctx, errors];
    }
}

module.exports = ValueAssetsOutside;
