'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');
const {set} = require('lodash');

class AnyPredeceasedWholeSiblings extends ValidationStep {

    static getUrl() {
        return '/deceased-whole-siblings';
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

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('hasOtherSiblingsWithSameParents');
    }

    nextStepOptions(ctx) {
        ctx.hadSomeOrAllPredeceasedWholeSibling = ((ctx.anyPredeceasedWholeSiblings === 'optionYesSome' || ctx.anyPredeceasedWholeSiblings === 'optionYesAll') && ctx.sameParents === 'optionBothParentsSame') ||
            (ctx.anyPredeceasedWholeSiblings === 'optionYesAll' && ctx.sameParents === 'optionOneParentsSame');
        ctx.hadNoPredeceasedWholeSiblings = ctx.anyPredeceasedWholeSiblings === 'optionNo' && ctx.sameParents === 'optionBothParentsSame';
        return {
            options: [
                {key: 'hadSomeOrAllPredeceasedWholeSibling', value: true, choice: 'hadSomeOrAllPredeceasedWholeSibling'},
                {key: 'hadNoPredeceasedWholeSiblings', value: true, choice: 'hadNoPredeceasedWholeSiblings'}
            ]
        };
    }

    handlePost(ctx, errors, formdata) {
        if (ctx.list?.length > 1 && formdata.applicant?.anyPredeceasedWholeSiblings && ctx.anyPredeceasedWholeSiblings !== formdata.applicant.anyPredeceasedWholeSiblings) {
            let relationshipToRemove = null;
            switch (ctx.anyPredeceasedWholeSiblings) {
            case 'optionNo':
                relationshipToRemove = 'optionWholeBloodNieceOrNephew';
                break;
            case 'optionYesAll':
                relationshipToRemove = 'optionWholeBloodSibling';
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

        if (formdata.applicant?.anyPredeceasedWholeSiblings && ctx.anyPredeceasedWholeSiblings !== formdata.applicant.anyPredeceasedWholeSiblings) {
            delete ctx.anySurvivingWholeNiecesAndWholeNephews;
            delete ctx.allWholeNiecesAndWholeNephewsOver18;
            delete ctx.allWholeSiblingsOver18;
        }

        return [ctx, formdata];
    }
}

module.exports = AnyPredeceasedWholeSiblings;
