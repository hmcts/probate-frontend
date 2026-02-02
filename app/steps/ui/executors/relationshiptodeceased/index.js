'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const ExecutorsWrapper = require('../../../../wrappers/Executors');
const pageUrl = '/coapplicant-relationship-to-deceased';

class CoApplicantRelationshipToDeceased extends ValidationStep {

    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
    }

    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            ctx.coApplicantRelationshipToDeceased = ctx.list[ctx.index].coApplicantRelationshipToDeceased;
        }
        return [ctx];
    }

    // eslint-disable-next-line complexity
    getContextData(req) {
        const formdata = req.session.form;
        const ctx = super.getContextData(req);
        if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
        } else {
            const executorsWrapper = new ExecutorsWrapper(formdata.executors);
            ctx.index = executorsWrapper.getNextIndex();
            ctx.redirect = `${pageUrl}/${ctx.index}`;
        }
        ctx.deceased = formdata.deceased;
        const hasOtherChildren = ctx.deceased?.anyOtherChildren === 'optionYes';
        const anyOtherHalfSiblings = formdata.applicant?.anyOtherHalfSiblings === 'optionYes';
        const anyPredeceasedHalfSiblings = formdata.applicant?.anyPredeceasedHalfSiblings;
        const hasAnySurvivingHalfNiecesAndHalfNephews = formdata.applicant?.anySurvivingHalfNiecesAndHalfNephews === 'optionYes';
        const hasNoSurvivingHalfNiecesAndHalfNephews = formdata.applicant?.anySurvivingHalfNiecesAndHalfNephews === 'optionNo';
        const anyOtherWholeSiblings = formdata.applicant?.anyOtherWholeSiblings === 'optionYes';
        const bothParentsSame = formdata.applicant?.relationshipToDeceased === 'optionSibling' && formdata.applicant?.sameParents === 'optionBothParentsSame';
        const oneParentSame = formdata.applicant?.relationshipToDeceased === 'optionSibling' && formdata.applicant?.sameParents === 'optionOneParentsSame';
        const anyPredeceasedWholeSiblings = formdata.applicant?.anyPredeceasedWholeSiblings;
        const hasAnySurvivingWholeNiecesAndWholeNephews = formdata.applicant?.anySurvivingWholeNiecesAndWholeNephews === 'optionYes';
        const hasNoSurvivingWholeNiecesAndWholeNephews = formdata.applicant?.anySurvivingWholeNiecesAndWholeNephews === 'optionNo';

        ctx.childOnly = hasOtherChildren &&
            (ctx.deceased.anyPredeceasedChildren === 'optionNo' ||
                (ctx.deceased.anyPredeceasedChildren === 'optionYesSome' && (ctx.deceased.anySurvivingGrandchildren === 'optionYes' || ctx.deceased.anySurvivingGrandchildren === 'optionNo')));
        ctx.grandChildOnly = hasOtherChildren &&
            ctx.deceased.anySurvivingGrandchildren === 'optionYes' &&
            (ctx.deceased.anyPredeceasedChildren === 'optionYesAll' || ctx.deceased.anyPredeceasedChildren === 'optionYesSome');
        ctx.halfSiblingOnly = oneParentSame && anyOtherHalfSiblings && (anyPredeceasedHalfSiblings === 'optionNo' || (anyPredeceasedHalfSiblings === 'optionYesSome' && (hasAnySurvivingHalfNiecesAndHalfNephews || hasNoSurvivingHalfNiecesAndHalfNephews)));
        ctx.halfNieceOrNephewOnly = oneParentSame && anyOtherHalfSiblings && hasAnySurvivingHalfNiecesAndHalfNephews && (anyPredeceasedHalfSiblings === 'optionYesAll' || anyPredeceasedHalfSiblings === 'optionYesSome');
        ctx.wholeSiblingOnly = bothParentsSame && anyOtherWholeSiblings && (anyPredeceasedWholeSiblings === 'optionNo' || (anyPredeceasedWholeSiblings === 'optionYesSome' && (hasAnySurvivingWholeNiecesAndWholeNephews || hasNoSurvivingWholeNiecesAndWholeNephews)));
        ctx.wholeNieceOrNephewOnly = bothParentsSame && anyOtherWholeSiblings && hasAnySurvivingWholeNiecesAndWholeNephews && (anyPredeceasedWholeSiblings === 'optionYesAll' || anyPredeceasedWholeSiblings === 'optionYesSome');
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }
    isComplete(ctx) {
        if (ctx.list[ctx.index]?.coApplicantRelationshipToDeceased) {
            return [true, 'inProgress'];
        }
        return [false, 'inProgress'];
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.deceasedName && errors) {
            errors[0].msg = errors[0].msg.replace('{deceasedName}', fields.deceasedName.value);
        }
        return fields;
    }

    nextStepUrl(req, ctx) {
        if (ctx.coApplicantRelationshipToDeceased === 'optionChild' || ctx.coApplicantRelationshipToDeceased === 'optionHalfBloodSibling' || ctx.coApplicantRelationshipToDeceased === 'optionWholeBloodSibling') {
            return `/coapplicant-name/${ctx.index}`;
        } else if (ctx.coApplicantRelationshipToDeceased === 'optionGrandchild' || ctx.coApplicantRelationshipToDeceased === 'optionHalfBloodNieceOrNephew' || ctx.coApplicantRelationshipToDeceased === 'optionWholeBloodNieceOrNephew') {
            return `/parent-die-before/${ctx.index}`;
        }
        return this.next(req, ctx).getUrlWithContext(ctx, 'otherCoApplicantRelationship');
    }

    nextStepOptions(ctx) {
        ctx.childOrSibling = ctx.list[ctx.index]?.coApplicantRelationshipToDeceased === 'optionChild' || ctx.list[ctx.index]?.coApplicantRelationshipToDeceased === 'optionHalfBloodSibling' || ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionWholeBloodSibling';
        ctx.grandchildOrNieceNephew = ctx.list[ctx.index]?.coApplicantRelationshipToDeceased === 'optionGrandchild' || ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionHalfBloodNieceOrNephew' || ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionWholeBloodNieceOrNephew';
        return {
            options: [
                {key: 'childOrSibling', value: true, choice: 'childOrSibling'},
                {key: 'grandchildOrNieceNephew', value: true, choice: 'grandchildOrNieceNephew'},
            ]
        };
    }

    handlePost(ctx, errors) {
        if (ctx.coApplicantRelationshipToDeceased === 'optionChild' || ctx.coApplicantRelationshipToDeceased === 'optionGrandchild' ||
            ctx.coApplicantRelationshipToDeceased === 'optionHalfBloodSibling' || ctx.coApplicantRelationshipToDeceased === 'optionHalfBloodNieceOrNephew' ||
            ctx.coApplicantRelationshipToDeceased === 'optionWholeBloodSibling' || ctx.coApplicantRelationshipToDeceased === 'optionWholeBloodNieceOrNephew') {
            ctx.list[ctx.index] = {
                ...ctx.list[ctx.index],
                coApplicantRelationshipToDeceased: ctx.coApplicantRelationshipToDeceased,
                isApplying: true
            };
        } else if (ctx.coApplicantRelationshipToDeceased === 'optionOther') {
            ctx.list[ctx.index] = {
                ...ctx.list[ctx.index],
                coApplicantRelationshipToDeceased: ctx.coApplicantRelationshipToDeceased,
                isApplying: false
            };
        }
        return [ctx, errors];
    }

    action(ctx, formdata) {
        if (formdata.executors && formdata.executors.list && ctx.list[ctx.index]?.coApplicantRelationshipToDeceased !== formdata.executors.list[ctx.index]?.coApplicantRelationshipToDeceased) {
            delete formdata.executors.list[ctx.index].childDieBeforeDeceased;
            delete formdata.executors.list[ctx.index].halfBloodSiblingDiedBeforeDeceased;
            delete formdata.executors.list[ctx.index].wholeBloodSiblingDiedBeforeDeceased;
        }
        super.action(ctx, formdata);
        return [ctx, formdata];
    }
}

module.exports = CoApplicantRelationshipToDeceased;
