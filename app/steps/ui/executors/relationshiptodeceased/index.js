'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const {set} = require('lodash');
const pageUrl = '/coapplicant-relationship-to-deceased';

class CoApplicantRelationshipToDeceased extends ValidationStep {

    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
    }

    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            ctx.coApplicantRelationshipToDeceased = ctx.list[ctx.index].coApplicantRelationshipToDeceased;
        }
        return [ctx];
    }

    getContextData(req) {
        const formdata = req.session.form;
        const ctx = super.getContextData(req);
        ctx.list = formdata.coApplicants?.list || [];
        if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
        } else {
            ctx.index = ctx.list.length;
            ctx.redirect = `${pageUrl}/${ctx.index}`;
        }
        ctx.deceased = formdata.deceased;
        const hasOtherChildren = ctx.deceased.anyOtherChildren === 'optionYes';

        ctx.childOnly = hasOtherChildren &&
            (ctx.deceased.anyPredeceasedChildren === 'optionNo' ||
                (ctx.deceased.anyPredeceasedChildren === 'optionYesSome' && ctx.deceased.anySurvivingGrandchildren === 'optionYes'));
        ctx.grandChildOnly = hasOtherChildren &&
            ctx.deceased.anySurvivingGrandchildren === 'optionYes' &&
            (ctx.deceased.anyPredeceasedChildren === 'optionYesAll' || ctx.deceased.anyPredeceasedChildren === 'optionYesSome');
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.deceasedName && errors) {
            errors[0].msg = errors[0].msg.replace('{deceasedName}', fields.deceasedName.value);
        }
        return fields;
    }

    nextStepUrl(req, ctx) {
        if (ctx.coApplicantRelationshipToDeceased === 'optionChild') {
            return `/coapplicant-name/${ctx.index}`;
        } else if (ctx.coApplicantRelationshipToDeceased === 'optionGrandchild') {
            return `/parent-die-before/${ctx.index}`;
        }
        return this.next(req, ctx).constructor.getUrl('OtherCoApplicantRelationship');
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
        if (ctx.coApplicantRelationshipToDeceased === 'optionChild' || ctx.coApplicantRelationshipToDeceased === 'optionGrandchild') {
            ctx.list[ctx.index] = {
                ...ctx.list[ctx.index],
                coApplicantRelationshipToDeceased: ctx.coApplicantRelationshipToDeceased,
                isApplying: true
            };
            set(formdata, 'coApplicants.list', ctx.list);
        }
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
