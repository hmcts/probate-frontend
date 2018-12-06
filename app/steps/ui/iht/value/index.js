'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const validator = require('validator');
const numeral = require('numeral');
const FieldError = require('app/components/error');
const FeatureToggle = require('app/utils/FeatureToggle');

class IhtValue extends ValidationStep {

    static getUrl() {
        return '/iht-value';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.isToggleEnabled = FeatureToggle.isEnabled(req.session.featureToggles, 'screening_questions');
        return ctx;
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

    nextStepOptions() {
        return {
            options: [
                {key: 'isToggleEnabled', value: true, choice: 'toggleOn'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.isToggleEnabled;
        return [ctx, formdata];
    }
}

module.exports = IhtValue;
