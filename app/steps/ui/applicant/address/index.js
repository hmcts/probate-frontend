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
        ctx.hasNoCoApplicant = ctx.caseType === caseTypes.INTESTACY && ((ctx.deceased.anyOtherChildren === 'optionYes' && ctx.deceased.anyPredeceasedChildren === 'optionYesAll' && ctx.deceased.anySurvivingGrandchildren === 'optionNo') || (ctx.deceased.anyOtherChildren === 'optionNo'));
        ctx.hasCoApplicant = ctx.caseType === caseTypes.INTESTACY && !ctx.hasNoCoApplicant;

        return {
            options: [
                {key: 'hasNoCoApplicant', value: true, choice: 'hasNoCoApplicant'},
                {key: 'hasCoApplicant', value: true, choice: 'hasCoApplicant'},
            ],
        };
    }
}

module.exports = ApplicantAddress;
