'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');
const {set} = require('lodash');

class AnyOtherWholeSiblings extends ValidationStep {

    static getUrl() {
        return '/deceased-other-whole-siblings';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        ctx.list = formdata.executors?.list;
        return ctx;
    }

    nextStepOptions(ctx) {
        ctx.hadOneParentSameAndHadNoWholeSiblings = ctx.anyOtherWholeSiblings === 'optionNo' && ctx.sameParents === 'optionOneParentsSame';
        return {
            options: [
                {key: 'anyOtherWholeSiblings', value: 'optionYes', choice: 'hadOtherWholeSiblings'},
                {key: 'hadOneParentSameAndHadNoWholeSiblings', value: true, choice: 'hadOneParentSameAndHadNoWholeSiblings'}
            ]
        };
    }

    handlePost(ctx, errors, formdata) {
        if (ctx.list?.length > 1 && formdata.applicant?.anyOtherWholeSiblings && ctx.anyOtherWholeSiblings !== formdata.applicant.anyOtherWholeSiblings) {
            if (ctx.anyOtherWholeSiblings === 'optionNo') {
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

        if (formdata.applicant?.anyOtherWholeSiblings && ctx.anyOtherWholeSiblings !== formdata.applicant.anyOtherWholeSiblings) {
            delete ctx.allWholeSiblingsOver18;
            delete ctx.anyPredeceasedWholeSiblings;
            delete ctx.anySurvivingWholeNiecesAndWholeNephews;
            delete ctx.allWholeNiecesAndWholeNephewsOver18;
        }

        return [ctx, formdata];
    }
}

module.exports = AnyOtherWholeSiblings;
