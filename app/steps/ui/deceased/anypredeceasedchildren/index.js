'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const {set} = require('lodash');

class AnyPredeceasedChildren extends ValidationStep {

    static getUrl() {
        return '/any-predeceased-children';
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

    nextStepOptions(ctx) {
        ctx.hadSomeOrAllPredeceasedChildren = ctx.anyPredeceasedChildren === 'optionYesSome' || ctx.anyPredeceasedChildren === 'optionYesAll';
        return {
            options: [
                {key: 'hadSomeOrAllPredeceasedChildren', value: true, choice: 'hadSomeOrAllPredeceasedChildren'},
                {key: 'anyPredeceasedChildren', value: 'optionNo', choice: 'optionNo'}
            ]
        };
    }
    handlePost(ctx, errors, formdata) {
        if (ctx.list?.length > 1 && formdata.deceased?.anyPredeceasedChildren && ctx.anyPredeceasedChildren !== formdata.deceased.anyPredeceasedChildren) {
            let relationshipToRemove = null;
            switch (ctx.anyPredeceasedChildren) {
            case 'optionNo':
                relationshipToRemove = 'optionGrandchild';
                break;
            case 'optionYesAll':
                relationshipToRemove = 'optionChild';
                break;
            default:
                break;
            }
            if (relationshipToRemove) {
                ctx.list = ctx.list.filter(coApplicant => coApplicant.coApplicantRelationshipToDeceased !== relationshipToRemove);
                set(formdata, 'executors.list', ctx.list);
            }
        }
        return super.handlePost(ctx, errors);
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.deceasedName;

        if (formdata.deceased?.anyPredeceasedChildren && ctx.anyPredeceasedChildren !== formdata.deceased.anyPredeceasedChildren) {
            delete ctx.anySurvivingGrandchildren;
            delete ctx.anyGrandchildrenUnder18;
            delete ctx.allChildrenOver18;
        }

        return [ctx, formdata];
    }
}

module.exports = AnyPredeceasedChildren;
