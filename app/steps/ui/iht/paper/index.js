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

    handlePost(ctx, errors, formdata, session) {
        const form = ctx.form.replace('option', '');
        ctx.grossValuePaper = ctx[`grossValueField${form}`];
        ctx.netValuePaper = ctx[`netValueField${form}`];

        ctx.grossValue = parseFloat(numeral(ctx.grossValuePaper).format('0.00'));
        ctx.netValue = parseFloat(numeral(ctx.netValuePaper).format('0.00'));

        if (!validator.isCurrency(ctx.grossValuePaper, {symbol: '£', allow_negatives: false})) {
            errors.push(FieldError(`grossValueField${form}`, 'invalidCurrencyFormat', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }

        if (!validator.isCurrency(ctx.netValuePaper, {symbol: '£', allow_negatives: false})) {
            errors.push(FieldError(`netValueField${form}`, 'invalidCurrencyFormat', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }

        if (ctx.netValue > ctx.grossValue) {
            errors.push(FieldError(`netValueField${form}`, 'netValueGreaterThanGross', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
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
        const softStopForNotAllowedIhtPaperForm = paperForm === 'optionIHT400421' || paperForm === 'optionIHT207';

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
