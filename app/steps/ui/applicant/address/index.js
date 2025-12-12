'use strict';

const AddressStep = require('app/core/steps/AddressStep');
const caseTypes = require('../../../../utils/CaseTypes');

class ApplicantAddress extends AddressStep {

    static getUrl() {
        return '/applicant-address';
    }

    getContextData(req) {
        const formdata = req.session.form;
        const ctx = super.getContextData(req);
        ctx.deceased = formdata.deceased;
        ctx.applicant = formdata.applicant;

        return ctx;
    }

    // eslint-disable-next-line complexity
    nextStepOptions(ctx) {
        if (ctx.caseType === caseTypes.GOP) {
            return {
                options: [
                    {key: 'ExecutorCheckWill', value: true, choice: 'ExecutorCheckWill'},
                ],
            };
        }
        const noOtherChildren = ctx.deceased.anyOtherChildren === 'optionNo';
        const allPredeceasedChildren = ctx.deceased.anyPredeceasedChildren === 'optionYesAll';
        const noSurvivingGrandchildren = ctx.deceased.anySurvivingGrandchildren === 'optionNo';
        const hasAnyOtherChildren = ctx.deceased.anyOtherChildren === 'optionYes';
        const wholeSibling = ctx.applicant?.sameParents === 'optionBothParentsSame';
        const halfSibling = ctx.applicant?.sameParents === 'optionOneParentsSame';
        const hasAnyOtherSiblings = ctx.applicant?.anyOtherHalfSiblings === 'optionYes' || ctx.applicant?.anyOtherWholeSiblings === 'optionYes';
        const hasNoOtherSiblings = ctx.applicant?.anyOtherHalfSiblings === 'optionNo' || ctx.applicant?.anyOtherWholeSiblings === 'optionNo';
        const allPredeceasedSiblings = ctx.applicant?.anyPredeceasedHalfSiblings === 'optionYesAll' || ctx.applicant?.anyPredeceasedWholeSiblings === 'optionYesAll';
        const noSurvivingNiecesAndNephews = ctx.applicant?.anySurvivingHalfNiecesAndHalfNephews === 'optionNo' || ctx.applicant?.anySurvivingWholeNiecesAndWholeNephews === 'optionNo';
        const commonCondition = hasAnyOtherChildren && allPredeceasedChildren && noSurvivingGrandchildren;
        const isIntestacy = ctx.caseType === caseTypes.INTESTACY;
        const isChild = ctx.relationshipToDeceased === 'optionChild';
        const isGrandchild = ctx.relationshipToDeceased === 'optionGrandchild';
        const isSibling = ctx.relationshipToDeceased === 'optionSibling';
        const isSpouseOrCivilPartner = ctx.relationshipToDeceased === 'optionSpousePartner';
        const grandchildParentHasNoOtherChildren = ctx.deceased.grandchildParentHasOtherChildren === 'optionNo';
        const siblingCommonCondition = isIntestacy && isSibling && ((hasAnyOtherSiblings && allPredeceasedSiblings && noSurvivingNiecesAndNephews) || hasNoOtherSiblings);

        const hasNoCoApplicantAndChildIsApplicant = isIntestacy && isChild && (commonCondition || noOtherChildren);

        const hasNoCoApplicantAndGrandchildIsApplicant = isIntestacy && isGrandchild && ((commonCondition && grandchildParentHasNoOtherChildren) || noOtherChildren);
        const hasNoCoApplicantAndWholeSiblingIsApplicant = siblingCommonCondition && wholeSibling;
        const hasNoCoApplicantAndHalfSiblingIsApplicant = siblingCommonCondition && halfSibling;
        ctx.hasNoCoapplicant = hasNoCoApplicantAndChildIsApplicant || hasNoCoApplicantAndGrandchildIsApplicant || isSpouseOrCivilPartner || hasNoCoApplicantAndWholeSiblingIsApplicant || hasNoCoApplicantAndHalfSiblingIsApplicant;
        ctx.hasCoApplicant = ctx.caseType === caseTypes.INTESTACY && (isChild || isGrandchild) && !ctx.hasNoCoapplicant;
        ctx.isIntestacyWithOtherParent = ctx.caseType === caseTypes.INTESTACY && ctx.relationshipToDeceased === 'optionParent' && ctx.deceased.anyOtherParentAlive === 'optionYes';
        ctx.isIntestacyNoOtherParent = ctx.caseType === caseTypes.INTESTACY && ctx.relationshipToDeceased === 'optionParent' && ctx.deceased.anyOtherParentAlive ===' optionNo';

        return {
            options: [
                {key: 'hasNoCoApplicant', value: true, choice: 'hasNoCoApplicant'},
                {key: 'hasCoApplicant', value: true, choice: 'hasCoApplicant'},
                {key: 'isIntestacyWithOtherParent', value: true, choice: 'isIntestacyWithOtherParent'},
                {key: 'isIntestacyNoOtherParent', value: true, choice: 'isIntestacyNoOtherParent'}
            ],
        };
    }
}

module.exports = ApplicantAddress;
