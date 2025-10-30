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

        ctx.hasNoCoApplicant = ctx.caseType === caseTypes.INTESTACY && ctx.relationshipToDeceased === 'optionChild' && (
            (ctx.deceased.anyOtherChildren === 'optionYes' &&
                ctx.deceased.anyPredeceasedChildren === 'optionYesAll' &&
                ctx.deceased.anySurvivingGrandchildren === 'optionNo') ||
            (ctx.deceased.anyOtherChildren === 'optionNo') || (typeof ctx.deceased.anyOtherChildren === 'undefined')
        );
        ctx.hasCoApplicant = ctx.caseType === caseTypes.INTESTACY && ctx.relationshipToDeceased === 'optionChild' && !ctx.hasNoCoApplicant;
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
