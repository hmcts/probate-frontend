'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const {get, set} = require('lodash');
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
        ctx.list = formdata.executors?.list;
        return ctx;
    }

    nextStepUrl(req, ctx) {
        if (ctx.relationshipToDeceased === 'optionOther') {
            if (ctx.deceasedMaritalStatus === 'optionMarried') {
                return this.next(req, ctx).getUrlWithContext(ctx, 'deceasedHadLegalPartnerAndRelationshipOther');
            }
            return this.next(req, ctx).getUrlWithContext(ctx, 'deceasedNoLegalPartnerAndRelationshipOther');
        }
        return this.next(req, ctx).getUrlWithContext(ctx, 'otherRelationship');
    }

    nextStepOptions(ctx) {
        ctx.spousePartnerLessThanIhtThreshold = ctx.relationshipToDeceased === 'optionSpousePartner' && ctx.assetsValue <= ctx.ihtThreshold;
        ctx.spousePartnerMoreThanIhtThreshold = ctx.relationshipToDeceased === 'optionSpousePartner' && ctx.assetsValue > ctx.ihtThreshold;
        ctx.childOrGrandchildDeceasedMarried = (ctx.relationshipToDeceased === 'optionChild' || ctx.relationshipToDeceased === 'optionGrandchild') && ctx.deceasedMaritalStatus === 'optionMarried';
        ctx.parentSiblingNotMarried = (ctx.relationshipToDeceased === 'optionParent' || ctx.relationshipToDeceased === 'optionSibling') && ctx.deceasedMaritalStatus !== 'optionMarried';
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
    handlePost(ctx, errors, formdata) {
        if (ctx.list?.length > 0 && formdata.applicant?.relationshipToDeceased && ctx.relationshipToDeceased !== formdata.applicant.relationshipToDeceased) {
            ctx.list.splice(0);
            set(formdata, 'executors.list', ctx.list);
        }
        return super.handlePost(ctx, errors);
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

        if (formdata.applicant?.relationshipToDeceased && ctx.relationshipToDeceased !== formdata.applicant.relationshipToDeceased) {
            delete ctx.spouseNotApplyingReason;

            if (formdata.deceased) {
                delete formdata.deceased.anyChildren;
                delete formdata.deceased.anyOtherChildren;
                delete formdata.deceased.allChildrenOver18;
                delete formdata.deceased.anyPredeceasedChildren;
                delete formdata.deceased.anySurvivingGrandchildren;
                delete formdata.deceased.anyGrandchildrenUnder18;
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
