'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const validator = require('validator');
const numeral = require('numeral');
const FieldError = require('app/components/error');
const {get} = require('lodash');
const IhtThreshold = require('app/utils/IhtThreshold');

class ValueAssetsOutside extends ValidationStep {

    static getUrl() {
        return '/value-assets-outside-england-wales*';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.ihtThreshold = IhtThreshold.getIhtThreshold(new Date(get(formdata, 'deceased.dod-date')));
        return ctx;
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

        if (formdata.deceased && (ctx.netValue + ctx.netValueAssetsOutside) <= ctx.ihtThreshold) {
            delete formdata.deceased.anyChildren;
            delete formdata.deceased.allChildrenOver18;
            delete formdata.deceased.anyDeceasedChildren;
            delete formdata.deceased.anyGrandchildrenUnder18;
        }

        delete ctx.ihtThreshold;

        return [ctx, formdata];
    }
}

module.exports = ValueAssetsOutside;
