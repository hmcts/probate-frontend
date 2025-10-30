'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');

class AnyOtherChildren extends ValidationStep {

    static getUrl() {
        return '/any-other-children';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        ctx.relationshipToDeceased = formdata.applicant && formdata.applicant.relationshipToDeceased;
        return ctx;
    }

    nextStepOptions(ctx) {
        ctx.childAndHadNoChildren = ctx.relationshipToDeceased === 'optionChild' && ctx.anyOtherChildren === 'optionNo';
        ctx.grandchildAndHadNoChildren = ctx.relationshipToDeceased === 'optionGrandchild' && ctx.anyOtherChildren === 'optionNo';
        return {
            options: [
                {key: 'anyOtherChildren', value: 'optionYes', choice: 'hadOtherChildren'},
                {key: 'childAndHadNoChildren', value: true, choice: 'childAndHadNoChildren'},
                {key: 'grandchildAndHadNoChildren', value: true, choice: 'grandchildAndHadNoChildren'}
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

        if (formdata.deceased && formdata.deceased.anyOtherChildren && ctx.anyOtherChildren !== formdata.deceased.anyOtherChildren) {
            delete ctx.allChildrenOver18;
            delete ctx.anyPredeceasedChildren;
            delete ctx.anyGrandchildrenUnder18;
        }

        return [ctx, formdata];
    }
}

module.exports = AnyOtherChildren;
