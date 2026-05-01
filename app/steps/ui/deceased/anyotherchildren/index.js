'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');
const {set} = require('lodash');

class AnyOtherChildren extends ValidationStep {

    static getUrl() {
        return '/any-other-children';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        ctx.relationshipToDeceased = formdata.applicant && formdata.applicant.relationshipToDeceased;
        ctx.list = formdata.executors?.list;
        return ctx;
    }

    nextStepOptions(ctx) {
        ctx.childAndHadNoChildren = ctx.relationshipToDeceased === 'optionChild' && ctx.anyOtherChildren === 'optionNo';
        ctx.grandchildAndHadNoChildren = ctx.relationshipToDeceased === 'optionGrandchild' && ctx.anyOtherChildren === 'optionNo';
        return {
            options: [
                {key: 'grandchildAndHadNoChildren', value: true, choice: 'grandchildAndHadNoChildren'},
                {key: 'anyOtherChildren', value: 'optionYes', choice: 'hadOtherChildren'},
            ]
        };
    }

    handlePost(ctx, errors, formdata) {
        if (ctx.list?.length > 1 && formdata.deceased?.anyOtherChildren && ctx.anyOtherChildren !== formdata.deceased.anyOtherChildren) {
            if (ctx.anyOtherChildren === 'optionNo') {
                ctx.list.splice(1);
                set(formdata, 'executors.list', ctx.list);
            }
        }
        return super.handlePost(ctx, errors);
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

        if (formdata.deceased?.anyOtherChildren && ctx.anyOtherChildren !== formdata.deceased.anyOtherChildren) {
            delete ctx.allChildrenOver18;
            delete ctx.anyPredeceasedChildren;
            delete ctx.anyGrandchildrenUnder18;
        }

        return [ctx, formdata];
    }
}

module.exports = AnyOtherChildren;
