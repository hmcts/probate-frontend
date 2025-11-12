'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');

class SpouseNotApplyingReason extends ValidationStep {

    static getUrl() {
        return '/spouse-not-applying-reason';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('spouseNotApplying');
    }

    nextStepOptions(ctx) {
        ctx.childAndSpouseNotApplying = ctx.relationshipToDeceased === 'optionChild' && ctx.spouseNotApplyingReason === 'optionRenouncing';
        ctx.grandchildAndSpouseNotApplying = ctx.relationshipToDeceased === 'optionGrandchild' && ctx.spouseNotApplyingReason === 'optionRenouncing';
        return {
            options: [
                {key: 'childAndSpouseNotApplying', value: true, choice: 'childAndSpouseNotApplying'},
                {key: 'grandchildAndSpouseNotApplying', value: true, choice: 'grandchildAndSpouseNotApplying'},
            ]
        };
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.deceasedName && errors) {
            errors[0].msg = errors[0].msg.replace('{deceasedName}', fields.deceasedName.value);
        }
        return fields;
    }
}

module.exports = SpouseNotApplyingReason;
