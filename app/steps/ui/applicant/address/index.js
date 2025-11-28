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

        return ctx;
    }

    nextStepOptions(ctx) {
        if (ctx.caseType === caseTypes.GOP) {
            return {
                options: [
                    {key: 'ExecutorCheckWill', value: true, choice: 'ExecutorCheckWill'},
                ],
            };
        }
        const noOtherChildren = ctx.deceased.anyOtherChildren === 'optionNo';
        const undefinedOtherChildren = typeof ctx.deceased.anyOtherChildren === 'undefined';
        const allPredeceasedChildren = ctx.deceased.anyPredeceasedChildren === 'optionYesAll';
        const noSurvivingGrandchildren = ctx.deceased.anySurvivingGrandchildren === 'optionNo';
        const hasAnyOtherChildren = ctx.deceased.anyOtherChildren === 'optionYes';
        const commonCondition = hasAnyOtherChildren && allPredeceasedChildren && noSurvivingGrandchildren;
        const isIntestacy = ctx.caseType === caseTypes.INTESTACY;
        const isChild = ctx.relationshipToDeceased === 'optionChild';
        const isGrandchild = ctx.relationshipToDeceased === 'optionGrandchild';
        const grandchildParentHasNoOtherChildren = ctx.deceased.grandchildParentHasOtherChildren === 'optionNo';

        const hasNoCoApplicantAndChildIsApplicant = isIntestacy && (isChild ? (commonCondition || noOtherChildren) : undefinedOtherChildren);

        const hasNoCoApplicantAndGrandchildIsApplicant = isIntestacy && (isGrandchild ? ((commonCondition && grandchildParentHasNoOtherChildren) || noOtherChildren) : undefinedOtherChildren);
        ctx.hasNoCoapplicant = hasNoCoApplicantAndChildIsApplicant || hasNoCoApplicantAndGrandchildIsApplicant;
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
