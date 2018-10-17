'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const validator = require('validator');
const numeral = require('numeral');
const FieldError = require('app/components/error');
const {get} = require('lodash');

class IhtPaper extends ValidationStep {

    static getUrl() {
        return '/iht-paper';
    }

    handlePost(ctx, errors) {
        ctx.grossValuePaper = ctx[`gross${ctx.form}`];
        ctx.netValuePaper = ctx[`net${ctx.form}`];

        ctx.grossValue = numeral(ctx.grossValuePaper).value();
        ctx.netValue = numeral(ctx.netValuePaper).value();

        if (!validator.isCurrency(ctx.grossValuePaper, {symbol: '£', allow_negatives: false})) {
            errors.push(FieldError(`gross${ctx.form}`, 'invalidCurrencyFormat', this.resourcePath, this.generateContent()));
        }

        if (!validator.isCurrency(ctx.netValuePaper, {symbol: '£', allow_negatives: false})) {
            errors.push(FieldError(`net${ctx.form}`, 'invalidCurrencyFormat', this.resourcePath, this.generateContent()));
        }

        if (ctx.netValue > ctx.grossValue) {
            errors.push(FieldError(`net${ctx.form}`, 'netValueGreaterThanGross', this.resourcePath, this.generateContent()));
        }

        ctx.grossValue = Math.floor(ctx.grossValue);
        ctx.netValue = Math.floor(ctx.netValue);

        ctx.ihtFormId = ctx.form;
        return [ctx, errors];
    }

    isSoftStop(formdata) {
        const paperForm = get(formdata, 'iht.form', {});
        const softStopForNotAllowedIhtPaperForm = paperForm === 'IHT400421' || paperForm === 'IHT207';

        return {
            'stepName': this.constructor.name,
            'isSoftStop': softStopForNotAllowedIhtPaperForm
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.grossValuePaper;
        delete ctx.netValuePaper;
        return [ctx, formdata];
    }
}

module.exports = IhtPaper;
