'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const {get} = require('lodash');
const IhtThreshold = require('app/utils/IhtThreshold');
const FormatName = require('app/utils/FormatName');
const logger = require('app/components/logger');

class RelationshipToDeceased extends ValidationStep {

    static getUrl() {
        return '/relationship-to-deceased';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.ihtThreshold = IhtThreshold.getIhtThreshold(new Date(get(formdata, 'deceased.dod-date')));
        ctx.deceasedMaritalStatus = get(formdata, 'deceased.maritalStatus');
        ctx.assetsValue = get(formdata, 'iht.netValue', 0) + get(formdata, 'iht.netValueAssetsOutside', 0);
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    nextStepUrl(req, ctx) {
        if (ctx.relationshipToDeceased === 'optionOther') {
            if (ctx.deceasedMaritalStatus === 'optionMarried') {
                return this.next(req, ctx).constructor.getUrl('deceasedHadLegalPartnerAndRelationshipOther');
            }
            return this.next(req, ctx).constructor.getUrl('deceasedNoLegalPartnerAndRelationshipOther');
        }
        return this.next(req, ctx).constructor.getUrl('otherRelationship');
    }

    nextStepOptions(ctx) {
        ctx.spousePartnerLessThanIhtThreshold = ctx.relationshipToDeceased === 'optionSpousePartner' && ctx.assetsValue <= ctx.ihtThreshold;
        ctx.spousePartnerMoreThanIhtThreshold = ctx.relationshipToDeceased === 'optionSpousePartner' && ctx.assetsValue > ctx.ihtThreshold;
        ctx.childOrGrandchildDeceasedMarried = (ctx.relationshipToDeceased === 'optionChild' || ctx.relationshipToDeceased === 'optionGrandchild') && ctx.deceasedMaritalStatus === 'optionMarried';
        ctx.parentSiblingNotMarried = (ctx.relationshipToDeceased === 'optionParent' || ctx.relationshipToDeceased === 'optionSibling') && ctx.deceasedMaritalStatus === 'optionNotMarried';
        ctx.childAndDeceasedNotMarried = ctx.relationshipToDeceased === 'optionChild' && ctx.deceasedMaritalStatus !== 'optionMarried';
        ctx.grandchildAndDeceasedNotMarried = ctx.relationshipToDeceased === 'optionGrandchild' && ctx.deceasedMaritalStatus !== 'optionMarried';

        return {
            options: [
                {key: 'spousePartnerLessThanIhtThreshold', value: true, choice: 'spousePartnerLessThanIhtThreshold'},
                {key: 'spousePartnerMoreThanIhtThreshold', value: true, choice: 'spousePartnerMoreThanIhtThreshold'},
                {key: 'childOrGrandchildDeceasedMarried', value: true, choice: 'childOrGrandchildDeceasedMarried'},
                {key: 'parentSiblingNotMarried', value: true, choice: 'parentSiblingNotMarried'},
                {key: 'childAndDeceasedNotMarried', value: true, choice: 'childAndDeceasedNotMarried'},
                {key: 'grandchildAndDeceasedNotMarried', value: true, choice: 'grandchildAndDeceasedNotMarried'},
                {key: 'relationshipToDeceased', value: 'optionAdoptedChild', choice: 'adoptedChild'},
            ]
        };
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);

        if (fields.deceasedName && errors) {
            for (const error of errors) {
                const match = error.msg.match(/{deceasedName}/g);
                if (match) {
                    error.msg = error.msg.replace('{deceasedName}', fields.deceasedName.value);
                }
            }
        }

        return fields;
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
        if (ctx.relationshipToDeceased === 'optionChild') {
            delete ctx.grandchildParentAdoptedIn;
            delete ctx.grandchildParentAdoptedOut;
            delete ctx.grandchildParentAdoptionPlace;
        } else if (ctx.relationshipToDeceased === 'optionGrandchild') {
            delete ctx.childAdoptedIn;
            delete ctx.childAdoptedOut;
            delete ctx.childAdoptionPlace;
        }

        if (formdata.applicant && formdata.applicant.relationshipToDeceased && ctx.relationshipToDeceased !== formdata.applicant.relationshipToDeceased) {
            delete ctx.adoptionPlace;
            delete ctx.spouseNotApplyingReason;

            if (formdata.deceased) {
                delete formdata.deceased.anyChildren;
                delete formdata.deceased.anyOtherChildren;
                delete formdata.deceased.allChildrenOver18;
                delete formdata.deceased.anyPredeceasedChildren;
                delete formdata.deceased.anySurvivingGrandchildren;
                delete formdata.deceased.anyGrandchildrenUnder18;
            }
            if (formdata.details) {
                delete formdata.details.childAdoptedIn;
                delete formdata.details.grandchildParentAdoptedIn;
                delete formdata.details.childAdoptedOut;
                delete formdata.details.grandchildParentAdoptedOut;
                delete formdata.details.childAdoptionPlace;
                delete formdata.details.grandchildParentAdoptionPlace;
            }
        }

        return [ctx, formdata];
    }

    isComplete(ctx, formdata) {
        const marStat = formdata?.deceased?.maritalStatus;
        const relToDec = formdata?.applicant?.relationshipToDeceased;
        if (marStat) {
            if (marStat !== 'optionMarried' &&
                relToDec === 'optionSpousePartner') {
                logger().info(`marStat: ${marStat}, relToDec: ${relToDec}, cannot be spouse if unmarried`);
                return [false, 'inProgress'];
            } else if (marStat === 'optionMarried' &&
                    (relToDec === 'optionParent' ||
                        relToDec === 'optionSibling')) {
                logger().info(`marStat: ${marStat}, relToDec: ${relToDec}, cannot be parent/sibling if married`);
                return [false, 'inProgress'];
            }
        }

        return super.isComplete(ctx, formdata);
    }
}

module.exports = RelationshipToDeceased;
