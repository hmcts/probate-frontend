'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');
const {set} = require('lodash');

class AnySurvivingWholeNiecesAndWholeNephews extends ValidationStep {

    static getUrl() {
        return '/whole-siblings-surviving-children';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        ctx.list = formdata.executors?.list;
        return ctx;
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).getUrlWithContext(ctx, 'hasSurvivingChildrenWithOneParent');
    }

    nextStepOptions(ctx) {
        ctx.hasBothParentsSameAndHasSurvivors = ctx.anySurvivingWholeNiecesAndWholeNephews === 'optionYes' && ctx.sameParents === 'optionBothParentsSame' && (ctx.anyPredeceasedWholeSiblings === 'optionYesAll' || ctx.anyPredeceasedWholeSiblings === 'optionYesSome');
        ctx.hasBothParentsSameAndHadOtherWholeSiblingAndHadNoSurvivors = ctx.anySurvivingWholeNiecesAndWholeNephews === 'optionNo' && ctx.anyPredeceasedWholeSiblings === 'optionYesSome' && ctx.sameParents === 'optionBothParentsSame';
        ctx.hasBothParentsSameAndHadNoOtherWholeSiblingAndHadNoSurvivors = ctx.anySurvivingWholeNiecesAndWholeNephews === 'optionNo' && ctx.anyPredeceasedWholeSiblings === 'optionYesAll' && ctx.sameParents === 'optionBothParentsSame';
        ctx.hasOneParentsSameAndHadAllPredeceasedWholeSiblingAndNoSurvivors = ctx.anySurvivingWholeNiecesAndWholeNephews === 'optionNo' && ctx.anyPredeceasedWholeSiblings === 'optionYesAll' && ctx.sameParents === 'optionOneParentsSame';
        return {
            options: [
                {key: 'hasBothParentsSameAndHasSurvivors', value: true, choice: 'hasBothParentsSameAndHasSurvivors'},
                {key: 'hasBothParentsSameAndHadOtherWholeSiblingAndHadNoSurvivors', value: true, choice: 'hasBothParentsSameAndHadOtherWholeSiblingAndHadNoSurvivors'},
                {key: 'hasBothParentsSameAndHadNoOtherWholeSiblingAndHadNoSurvivors', value: true, choice: 'hasBothParentsSameAndHadNoOtherWholeSiblingAndHadNoSurvivors'},
                {key: 'hasOneParentsSameAndHadAllPredeceasedWholeSiblingAndNoSurvivors', value: true, choice: 'hasOneParentsSameAndHadAllPredeceasedWholeSiblingAndNoSurvivors'}
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
        if (ctx.list?.length > 1 && formdata.applicant?.anySurvivingWholeNiecesAndWholeNephews && ctx.anySurvivingWholeNiecesAndWholeNephews !== formdata.applicant.anySurvivingWholeNiecesAndWholeNephews) {
            if (ctx.anySurvivingWholeNiecesAndWholeNephews === 'optionNo') {
                if (formdata.applicant.anyPredeceasedWholeSiblings === 'optionYesSome') {
                    ctx.list = ctx.list.filter(coApplicant => coApplicant.coApplicantRelationshipToDeceased !== 'optionWholeBloodNieceOrNephew');
                } else if (formdata.applicant.anyPredeceasedWholeSiblings === 'optionYesAll') {
                    ctx.list.splice(1);
                }
                set(formdata, 'executors.list', ctx.list);
            }
        }
        return super.handlePost(ctx, errors);
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);

        if (formdata.applicant?.anySurvivingWholeNiecesAndWholeNephews && ctx.anySurvivingWholeNiecesAndWholeNephews !== formdata.applicant.anySurvivingWholeNiecesAndWholeNephews) {
            delete ctx.allWholeNiecesAndWholeNephewsOver18;
        }

        return [ctx, formdata];
    }
}

module.exports = AnySurvivingWholeNiecesAndWholeNephews;
