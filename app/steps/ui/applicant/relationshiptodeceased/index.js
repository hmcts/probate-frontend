'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const {get} = require('lodash');
const config = require('app/config');

class RelationshipToDeceased extends ValidationStep {

    static getUrl() {
        return '/relationship-to-deceased';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedMaritalStatus = get(formdata, 'deceased.maritalStatus');
        ctx.assetsValue = get(formdata, 'iht.netValue', 0) + get(formdata, 'iht.netValueAssetsOutside', 0);
        return ctx;
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('otherRelationship');
    }

    nextStepOptions(ctx) {
        ctx.spousePartnerLessThan250k = ctx.relationshipToDeceased === 'optionSpousePartner' && ctx.assetsValue <= config.assetsValueThreshold;
        ctx.spousePartnerMoreThan250k = ctx.relationshipToDeceased === 'optionSpousePartner' && ctx.assetsValue > config.assetsValueThreshold;
        ctx.childDeceasedMarried = ctx.relationshipToDeceased === 'optionChild' && ctx.deceasedMaritalStatus === 'optionMarried';
        ctx.childDeceasedNotMarried = ctx.relationshipToDeceased === 'optionChild' && ctx.deceasedMaritalStatus !== 'optionMarried';

        return {
            options: [
                {key: 'spousePartnerLessThan250k', value: true, choice: 'spousePartnerLessThan250k'},
                {key: 'spousePartnerMoreThan250k', value: true, choice: 'spousePartnerMoreThan250k'},
                {key: 'childDeceasedMarried', value: true, choice: 'childDeceasedMarried'},
                {key: 'childDeceasedNotMarried', value: true, choice: 'childDeceasedNotMarried'},
                {key: 'relationshipToDeceased', value: 'optionAdoptedChild', choice: 'adoptedChild'},
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.assetsValue;
        delete ctx.spousePartnerLessThan250k;
        delete ctx.spousePartnerMoreThan250k;
        delete ctx.childDeceasedMarried;
        delete ctx.childDeceasedNotMarried;

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

module.exports = RelationshipToDeceased;
