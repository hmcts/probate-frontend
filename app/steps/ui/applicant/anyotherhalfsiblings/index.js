'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');
const {set} = require('lodash');

class AnyOtherHalfSiblings extends ValidationStep {

    static getUrl() {
        return '/deceased-other-half-siblings';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        ctx.list = formdata.executors?.list;
        return ctx;
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'anyOtherHalfSiblings', value: 'optionYes', choice: 'hadOtherOtherHalfSiblings'}
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

    handlePost(ctx, errors, formdata) {
        if (ctx.list?.length > 1 && formdata.applicant?.anyOtherHalfSiblings && ctx.anyOtherHalfSiblings !== formdata.applicant.anyOtherHalfSiblings) {
            if (ctx.anyOtherHalfSiblings === 'optionNo') {
                ctx.list.splice(1);
                set(formdata, 'executors.list', ctx.list);
            }
        }
        return super.handlePost(ctx, errors);
    }

    action(ctx, formdata) {//check after other pages are done
        super.action(ctx, formdata);

        if (formdata.applicant?.anyOtherHalfSiblings && ctx.anyOtherHalfSiblings !== formdata.applicant.anyOtherHalfSiblings) {
            delete ctx.allHalfSiblingsOver18;
            delete ctx.anyPredeceasedHalfSiblings;
            delete ctx.anySurvivingHalfNiecesAndHalfNephews;
            delete ctx.allHalfNiecesAndHalfNephewsOver18;
        }

        return [ctx, formdata];
    }
}

module.exports = AnyOtherHalfSiblings;
