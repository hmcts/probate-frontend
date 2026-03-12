'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const validator = require('validator');
const numeral = require('numeral');
const FieldError = require('app/components/error');
const {get} = require('lodash');
const AssetsThreshold = require('app/utils/AssetsThreshold');

class IhtValue extends ValidationStep {

    static getUrl() {
        return '/iht-value';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.assetsThreshold = AssetsThreshold.getAssetsThreshold(new Date(get(formdata, 'deceased.dod-date')));
        return ctx;
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

    nextStepOptions(ctx) {
        ctx.lessThanOrEqualToAssetsThreshold = ctx.netValue <= ctx.assetsThreshold;

        return {
            options: [
                {key: 'lessThanOrEqualToAssetsThreshold', value: true, choice: 'lessThanOrEqualToAssetsThreshold'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.lessThanOrEqualToAssetsThreshold;

        if (ctx.netValue > ctx.assetsThreshold) {
            delete ctx.assetsOutside;
            delete ctx.netValueAssetsOutsideField;
            delete ctx.netValueAssetsOutside;
        }

        if (formdata.deceased && ctx.netValue <= ctx.assetsThreshold) {
            delete formdata.deceased.anyChildren;
            delete formdata.deceased.allChildrenOver18;
            delete formdata.deceased.anyDeceasedChildren;
            delete formdata.deceased.anyGrandchildrenUnder18;
        }

        delete ctx.assetsThreshold;

        return [ctx, formdata];
    }
}

module.exports = IhtValue;
