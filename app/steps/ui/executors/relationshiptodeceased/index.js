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
        return this.next(req, ctx).getUrlWithContext(ctx, 'otherCoApplicantRelationship');
    }

    nextStepOptions(ctx) {
        const applicantRelToDec = ctx.list?.at(ctx.index)?.coApplicantRelationshipToDeceased;
        const childOrSiblingValues = ['optionChild', 'optionHalfBloodSibling', 'optionWholeBloodSibling'];
        const grandchildOrNieceNephewValues = ['optionGrandchild', 'optionHalfBloodNieceOrNephew', 'optionWholeBloodNieceOrNephew'];
        ctx.childOrSibling = childOrSiblingValues.includes(applicantRelToDec);
        ctx.grandchildOrNieceNephew = grandchildOrNieceNephewValues.includes(applicantRelToDec);
        return {
            options: [
                {key: 'childOrSibling', value: true, choice: 'childOrSibling'},
                {key: 'grandchildOrNieceNephew', value: true, choice: 'grandchildOrNieceNephew'},
            ]
        };
    }

    handlePost(ctx, errors, formdata) {
        if (formdata.executors && formdata.executors.list && ctx.coApplicantRelationshipToDeceased !== formdata.executors.list[ctx.index]?.coApplicantRelationshipToDeceased) {
            this.clearRelationshipFields(ctx, formdata);
        }
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
        super.action(ctx, formdata);
        return [ctx, formdata];
    }
    clearRelationshipFields(ctx, formdata) {
        const rel = formdata.executors.list[ctx.index]?.coApplicantRelationshipToDeceased;
        switch (rel) {
        case 'optionChild':
            delete ctx.list[ctx.index].childAdoptedIn;
            delete ctx.list[ctx.index].childAdoptionInEnglandOrWales;
            delete ctx.list[ctx.index].childAdoptedOut;
            break;
        case 'optionGrandchild':
            delete ctx.list[ctx.index].childDieBeforeDeceased;
            delete ctx.list[ctx.index].grandchildAdoptedIn;
            delete ctx.list[ctx.index].grandchildAdoptionInEnglandOrWales;
            delete ctx.list[ctx.index].grandchildAdoptedOut;
            delete ctx.list[ctx.index].grandchildParentAdoptedIn;
            delete ctx.list[ctx.index].grandchildParentAdoptionInEnglandOrWales;
            delete ctx.list[ctx.index].grandchildParentAdoptedOut;
            break;
        case 'optionWholeBloodSibling':
            delete ctx.list[ctx.index].wholeBloodSiblingAdoptedIn;
            delete ctx.list[ctx.index].wholeBloodSiblingAdoptionInEnglandOrWales;
            delete ctx.list[ctx.index].wholeBloodSiblingAdoptedOut;
            break;
        case 'optionHalfBloodSibling':
            delete ctx.list[ctx.index].halfBloodSiblingAdoptedIn;
            delete ctx.list[ctx.index].halfBloodSiblingAdoptionInEnglandOrWales;
            delete ctx.list[ctx.index].halfBloodSiblingAdoptedOut;
            break;
        case 'optionHalfBloodNieceOrNephew':
            delete ctx.list[ctx.index].halfBloodSiblingDiedBeforeDeceased;
            delete ctx.list[ctx.index].halfBloodNieceOrNephewAdoptedIn;
            delete ctx.list[ctx.index].halfBloodNieceOrNephewAdoptionInEnglandOrWales;
            delete ctx.list[ctx.index].halfBloodNieceOrNephewAdoptedOut;
            break;
        case 'optionWholeBloodNieceOrNephew':
            delete ctx.list[ctx.index].wholeBloodSiblingDiedBeforeDeceased;
            delete ctx.list[ctx.index].wholeBloodNieceOrNephewAdoptedIn;
            delete ctx.list[ctx.index].wholeBloodNieceOrNephewAdoptionInEnglandOrWales;
            delete ctx.list[ctx.index].wholeBloodNieceOrNephewAdoptedOut;
            break;
        default:
            break;
        }
        delete ctx.list[ctx.index]?.fullName;
        delete ctx.list[ctx.index]?.email;
        delete ctx.list[ctx.index]?.postcode;
        delete ctx.list[ctx.index]?.address;
    }
}

module.exports = CoApplicantRelationshipToDeceased;
