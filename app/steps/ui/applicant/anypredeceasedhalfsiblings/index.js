'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');
const {set} = require('lodash');

class AnyPredeceasedHalfSiblings extends ValidationStep {

    static getUrl() {
        return '/deceased-half-siblings';
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
        ctx.hadSomeOrAllPredeceasedHalfSibling = ctx.anyPredeceasedHalfSiblings === 'optionYesSome' || ctx.anyPredeceasedHalfSiblings === 'optionYesAll';
        return {
            options: [
                {key: 'hadSomeOrAllPredeceasedHalfSibling', value: true, choice: 'hadSomeOrAllPredeceasedHalfSibling'},
                {key: 'anyPredeceasedHalfSiblings', value: 'optionNo', choice: 'optionNo'}
            ]
        };
    }
    handlePost(ctx, errors, formdata) {
        if (ctx.list?.length > 1 && formdata.applicant?.anyPredeceasedHalfSiblings && ctx.anyPredeceasedHalfSiblings !== formdata.applicant.anyPredeceasedHalfSiblings) {
            let relationshipToRemove = null;
            switch (ctx.anyPredeceasedHalfSiblings) {
            case 'optionNo':
                relationshipToRemove = 'optionHalfBloodNieceOrNephew';
                break;
            case 'optionYesAll':
                relationshipToRemove = 'optionHalfBloodSibling';
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

        if (formdata.applicant?.anyPredeceasedHalfSiblings && ctx.anyPredeceasedHalfSiblings !== formdata.applicant.anyPredeceasedHalfSiblings) {
            delete ctx.anySurvivingHalfNiecesAndHalfNephews;
            delete ctx.allHalfNiecesAndHalfNephewsOver18;
            delete ctx.allHalfSiblingsOver18;
        }

        return [ctx, formdata];
    }
}

module.exports = AnyPredeceasedHalfSiblings;
