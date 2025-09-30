'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class CoApplicantRelationshipToDeceased extends ValidationStep {

    static getUrl() {
        return '/coapplicant-relationship-to-deceased';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        //const formdata = req.session.form;
        ctx.childOnly = true;
        ctx.grandChildOnly = true;
        //ctx.ihtThreshold = IhtThreshold.getIhtThreshold(new Date(get(formdata, 'deceased.dod-date')));
        //ctx.deceasedMaritalStatus = get(formdata, 'deceased.maritalStatus');
        //ctx.assetsValue = get(formdata, 'iht.netValue', 0) + get(formdata, 'iht.netValueAssetsOutside', 0);
        return ctx;
    }

    shouldPersistFormData() {
        return false;
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('coApplicantRelationshipToDeceased');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'coApplicantRelationshipToDeceased', value: 'optionChild', choice: 'optionChild'},
                {key: 'coApplicantRelationshipToDeceased', value: 'optionGrandchild', choice: 'optionGrandchild'},
            ]
        };
    }
    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.assetsValue;
        delete ctx.spousePartnerLessThanIhtThreshold;
        delete ctx.spousePartnerMoreThanIhtThreshold;
        delete ctx.childDeceasedMarried;
        delete ctx.childDeceasedNotMarried;
        delete ctx.deceasedMaritalStatus;
        delete ctx.ihtThreshold;

        if (formdata.applicant && formdata.applicant.relationshipToDeceased && ctx.relationshipToDeceased !== formdata.applicant.relationshipToDeceased) {
            delete ctx.adoptionPlace;
            delete ctx.spouseNotApplyingReason;

            if (formdata.deceased) {
                delete formdata.deceased.anyChildren;
                delete formdata.deceased.anyOtherChildren;
                delete formdata.deceased.allChildrenOver18;
                delete formdata.deceased.anyDeceasedChildren;
                delete formdata.deceased.anyGrandchildrenUnder18;
            }
        }

        return [ctx, formdata];
    }
}

module.exports = CoApplicantRelationshipToDeceased;
