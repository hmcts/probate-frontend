'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const {set} = require('lodash');
const pageUrl = '/coapplicant-relationship-to-deceased';

class CoApplicantRelationshipToDeceased extends ValidationStep {

    static getUrl() {
        //return `${pageUrl}/${index}`;
        return pageUrl;
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.childOnly = true;
        ctx.grandChildOnly = true;
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
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

    handlePost(ctx, errors, formdata) {
        ctx.list[0].fullName = 'full Name Hello 123';
        ctx.list[0].coApplicantRelationshipToDeceased = ctx.coApplicantRelationshipToDeceased;
        set(formdata, 'coApplicants.list', ctx.list);
        return [ctx, errors];
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
