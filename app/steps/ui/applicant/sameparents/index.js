'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');

class SameParents extends ValidationStep {

    static getUrl() {
        return '/deceased-same-parents';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('notEligibleSameParents');
    }

    nextStepOptions(ctx) {
        ctx.wholeOrHalfBloodSibling = ctx.sameParents === 'optionBothParentsSame' || ctx.sameParents === 'optionOneParentsSame';
        return {
            options: [
                {key: 'wholeOrHalfBloodSibling', value: true, choice: 'wholeOrHalfBloodSibling'}
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

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.deceasedName;
        return [ctx, formdata];
    }
}

module.exports = SameParents;
