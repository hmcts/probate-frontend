'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const validator = require('validator');
const numeral = require('numeral');
const FieldError = require('app/components/error');
const config = require('app/config');

class ValueAssetsOutside extends ValidationStep {

    static getUrl() {
        return '/value-assets-outside-england-wales';
    }

    handlePost(ctx, errors, formdata, session) {
        ctx.netValueAssetsOutside = parseFloat(numeral(ctx.netValueAssetsOutsideField).format('0.00'));

        if (!validator.isCurrency(ctx.netValueAssetsOutsideField, {symbol: '£', allow_negatives: false})) {
            errors.push(FieldError('netValueAssetsOutsideField', 'invalidCurrencyFormat', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }

        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);

        if (formdata.deceased && (ctx.netValue + ctx.netValueAssetsOutside) <= config.assetsValueThreshold) {
            delete formdata.deceased.anyChildren;
            delete formdata.deceased.allChildrenOver18;
            delete formdata.deceased.anyDeceasedChildren;
            delete formdata.deceased.anyGrandchildrenUnder18;
        }

        return [ctx, formdata];
    }
}

module.exports = ValueAssetsOutside;
