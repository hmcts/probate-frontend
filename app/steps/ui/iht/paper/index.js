'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const validator = require('validator');
const numeral = require('numeral');
const FieldError = require('app/components/error');
const {get} = require('lodash');
const config = require('app/config');

class IhtPaper extends ValidationStep {

    static getUrl() {
        return '/iht-paper';
    }

    handlePost(ctx, errors) {
        ctx.grossValuePaper = ctx[`grossValueField${ctx.form}`];
        ctx.netValuePaper = ctx[`netValueField${ctx.form}`];

        ctx.grossValue = parseFloat(numeral(ctx.grossValuePaper).format('0.00'));
        ctx.netValue = parseFloat(numeral(ctx.netValuePaper).format('0.00'));

        if (!validator.isCurrency(ctx.grossValuePaper, {symbol: '£', allow_negatives: false})) {
            errors.push(FieldError(`grossValueField${ctx.form}`, 'invalidCurrencyFormat', this.resourcePath, this.generateContent()));
        }

        if (!validator.isCurrency(ctx.netValuePaper, {symbol: '£', allow_negatives: false})) {
            errors.push(FieldError(`netValueField${ctx.form}`, 'invalidCurrencyFormat', this.resourcePath, this.generateContent()));
        }

        if (ctx.netValue > ctx.grossValue) {
            errors.push(FieldError(`netValueField${ctx.form}`, 'netValueGreaterThanGross', this.resourcePath, this.generateContent()));
        }

        ctx.ihtFormId = ctx.form;

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
        delete ctx.lessThanOrEqualTo250k;

        if (ctx.netValue > config.assetsValueThreshold) {
            delete ctx.assetsOutside;
            delete ctx.netValueAssetsOutsideField;
            delete ctx.netValueAssetsOutside;
        }

        if (formdata.deceased && ctx.netValue <= config.assetsValueThreshold) {
            delete formdata.deceased.anyChildren;
            delete formdata.deceased.allChildrenOver18;
            delete formdata.deceased.anyDeceasedChildren;
            delete formdata.deceased.anyGrandchildrenUnder18;
        }

        return [ctx, formdata];
    }
}

module.exports = IhtPaper;
