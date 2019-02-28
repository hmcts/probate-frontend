'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const content = require('app/resources/en/translation/applicant/relationshiptodeceased');
const contentMaritalStatus = require('app/resources/en/translation/deceased/maritalstatus');
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
        ctx.assetsValue = get(formdata, 'iht.netValue', 0) + get(formdata, 'deceased.netValueAssetsOutside', 0);
        return ctx;
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('otherRelationship');
    }

    nextStepOptions(ctx) {
        ctx.spousePartnerLessThan250k = ctx.relationshipToDeceased === content.optionSpousePartner && ctx.assetsValue <= config.assetsValueThreshold;
        ctx.spousePartnerMoreThan250k = ctx.relationshipToDeceased === content.optionSpousePartner && ctx.assetsValue > config.assetsValueThreshold;
        ctx.childDeceasedMarried = ctx.relationshipToDeceased === content.optionChild && ctx.deceasedMaritalStatus === contentMaritalStatus.optionMarried;
        ctx.childDeceasedNotMarried = ctx.relationshipToDeceased === content.optionChild && ctx.deceasedMaritalStatus !== contentMaritalStatus.optionMarried;

        return {
            options: [
                {key: 'spousePartnerLessThan250k', value: true, choice: 'spousePartnerLessThan250k'},
                {key: 'spousePartnerMoreThan250k', value: true, choice: 'spousePartnerMoreThan250k'},
                {key: 'childDeceasedMarried', value: true, choice: 'childDeceasedMarried'},
                {key: 'childDeceasedNotMarried', value: true, choice: 'childDeceasedNotMarried'},
                {key: 'relationshipToDeceased', value: content.optionAdoptedChild, choice: 'adoptedChild'},
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
        return [ctx, formdata];
    }
}

module.exports = RelationshipToDeceased;
