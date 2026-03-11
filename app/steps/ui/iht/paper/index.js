'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const validator = require('validator');
const numeral = require('numeral');
const FieldError = require('app/components/error');
const {get} = require('lodash');
const AssetsThreshold = require('app/utils/AssetsThreshold');

class IhtPaper extends ValidationStep {

    static getUrl() {
        return '/iht-paper';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.assetsThreshold = AssetsThreshold.getAssetsThreshold(new Date(get(formdata, 'deceased.dod-date')));
        return ctx;
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
        ctx.lessThanOrEqualToAssetsThreshold = ctx.netValue <= ctx.assetsThreshold;

        return {
            options: [
                {key: 'lessThanOrEqualToAssetsThreshold', value: true, choice: 'lessThanOrEqualToAssetsThreshold'}
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

module.exports = IhtPaper;
