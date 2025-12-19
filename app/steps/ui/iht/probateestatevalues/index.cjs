'use strict';

const ValidationStep = require('app/core/steps/ValidationStep.cjs');
const numeral = require('numeral');
const FieldError = require('app/components/error');
const IhtThreshold = require('app/utils/IhtThreshold.cjs');
const {get} = require('lodash');
const featureToggle = require('app/utils/FeatureToggle.cjs');
const ExceptedEstateDod = require('app/utils/ExceptedEstateDod');
const IhtEstateValuesUtil = require('app/utils/IhtEstateValuesUtil.cjs');

class ProbateEstateValues extends ValidationStep {

    static getUrl() {
        return '/probate-estate-values';
    }

    getContextData(req) {
        const ctx =super.getContextData(req);
        const formData = req.session.form;
        if (formData.deceased['dod-date']!== null && typeof formData.deceased['dod-date']!== 'undefined') {
            ctx.dateOfDeath = ExceptedEstateDod.afterEeDodThreshold(formData.deceased['dod-date']);
        }
        if (ctx.netValueField!== null && typeof ctx.netValueField!== 'undefined') {
            ctx.netValue = parseFloat(numeral(ctx.netValueField).format('0.00'));
            const formdata = req.session.form;
            if (featureToggle.isEnabled(req.session.featureToggles, 'ft_excepted_estates') && ExceptedEstateDod.afterEeDodThreshold(get(formdata, 'deceased.dod-date'))) {
                ctx.lessThanOrEqualToIhtThreshold = true;
            } else if (featureToggle.isEnabled(req.session.featureToggles, 'ft_excepted_estates') && ExceptedEstateDod.beforeEeDodThreshold(get(formdata, 'deceased.dod-date'))) {
                ctx.ihtThreshold = IhtThreshold.getIhtThreshold(new Date(get(formdata, 'deceased.dod-date')));
                ctx.lessThanOrEqualToIhtThreshold = ctx.netValue <= ctx.ihtThreshold;
            }
        }
        return ctx;
    }

    handlePost(ctx, errors, formdata, session) {
        if (!IhtEstateValuesUtil.isPositiveInteger(ctx.grossValueField)) {
            errors.push(FieldError('grossValueField', 'invalidInteger', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }
        if (!IhtEstateValuesUtil.isPositiveInteger(ctx.netValueField)) {
            errors.push(FieldError('netValueField', 'invalidInteger', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }
        ctx.grossValue = parseFloat(numeral(ctx.grossValueField).format('0.00'));
        ctx.netValue = parseFloat(numeral(ctx.netValueField).format('0.00'));

        if (ctx.netValue > ctx.grossValue) {
            errors.push(FieldError('netValueField', 'netValueGreaterThanGross', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }

        return [ctx, errors];
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'lessThanOrEqualToIhtThreshold', value: true, choice: 'lessThanOrEqualToIhtThreshold'}
            ]
        };
    }

    isComplete(ctx) {
        return [
            typeof ctx.netValue !== 'undefined' && typeof ctx.grossValue !== 'undefined' &&
                ctx.netValue !== null && ctx.grossValue !== null, 'inProgress'
        ];
    }
}

module.exports = ProbateEstateValues;
