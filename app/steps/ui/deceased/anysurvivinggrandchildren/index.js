'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');
const {set} = require('lodash');

class AnySurvivingGrandchildren extends ValidationStep {

    static getUrl() {
        return '/any-surviving-grandchildren';
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
        ctx.hadOtherChildrenAndHadNoSurvivingGrandchildren = ctx.anySurvivingGrandchildren === 'optionNo' && ctx.anyPredeceasedChildren === 'optionYesSome';
        ctx.childAndNoOtherChildrenAndHadNoSurvivingGrandchildren = ctx.relationshipToDeceased === 'optionChild' && ctx.anySurvivingGrandchildren === 'optionNo' && ctx.anyPredeceasedChildren === 'optionYesAll';
        ctx.grandchildAndNoSurvivingGrandchildrenOfOtherChildren = ctx.relationshipToDeceased === 'optionGrandchild' && ctx.anySurvivingGrandchildren === 'optionNo' && ctx.anyPredeceasedChildren === 'optionYesAll';
        return {
            options: [
                {key: 'anySurvivingGrandchildren', value: 'optionYes', choice: 'hadSurvivingGrandchildren'},
                {key: 'hadOtherChildrenAndHadNoSurvivingGrandchildren', value: true, choice: 'hadOtherChildrenAndHadNoSurvivingGrandchildren'},
                {key: 'childAndNoOtherChildrenAndHadNoSurvivingGrandchildren', value: true, choice: 'childAndNoOtherChildrenAndHadNoSurvivingGrandchildren'},
                {key: 'grandchildAndNoSurvivingGrandchildrenOfOtherChildren', value: true, choice: 'grandchildAndNoSurvivingGrandchildrenOfOtherChildren'}
            ]
        };
    }

    handlePost(ctx, errors, formdata) {
        if (ctx.list?.length > 1 && formdata.deceased?.anySurvivingGrandchildren && ctx.anySurvivingGrandchildren !== formdata.deceased.anySurvivingGrandchildren) {
            if (ctx.anySurvivingGrandchildren === 'optionNo') {
                if (formdata.deceased.anyPredeceasedChildren === 'optionYesSome') {
                    ctx.list = ctx.list.filter(coApplicant => coApplicant.coApplicantRelationshipToDeceased !== 'optionGrandchild');
                } else if (formdata.deceased.anyPredeceasedChildren === 'optionYesAll') {
                    ctx.list.splice(1);
                }
                set(formdata, 'executors.list', ctx.list);
            }
        }
        return super.handlePost(ctx, errors);
    }
    action(ctx, formdata) {
        super.action(ctx, formdata);

        if (formdata.deceased?.anySurvivingGrandchildren && ctx.anySurvivingGrandchildren !== formdata.deceased.anySurvivingGrandchildren) {
            delete ctx.anyGrandchildrenUnder18;
        }

        return [ctx, formdata];
    }
    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.deceasedName && errors) {
            errors[0].msg = errors[0].msg.replace('{deceasedName}', fields.deceasedName.value);
        }
        return fields;
    }

}

module.exports = AnySurvivingGrandchildren;
