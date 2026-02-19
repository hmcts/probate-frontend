'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');
const {set, get} = require('lodash');

class AnyOtherParentAlive extends ValidationStep {

    static getUrl() {
        return '/any-other-parent-alive';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        ctx.list = formdata.executors?.list;
        return ctx;
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.deceasedName && errors) {
            errors[0].msg = errors[0].msg.replace('{deceasedName}', fields.deceasedName.value);
        }
        return fields;
    }
    handlePost(ctx, errors, formdata) {
        ctx.applicantRelationshipToDeceased = get(formdata, 'applicant.relationshipToDeceased');
        if (ctx.applicantRelationshipToDeceased === 'optionParent' && ctx.list?.length === 2) {
            const lastIndex = ctx.list.length - 1;
            ctx.list.splice(lastIndex, 1);
            set(formdata, 'executors.list', ctx.list);
        }
        return super.handlePost(ctx, errors);
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);

        return [ctx, formdata];
    }
}

module.exports = AnyOtherParentAlive;
