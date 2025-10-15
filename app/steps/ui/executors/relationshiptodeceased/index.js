'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
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
        if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
        } else {
            const lastIndex = ctx.list.length - 1;
            if (ctx.list[lastIndex] && (ctx.list[lastIndex].isApplicant === true || (typeof ctx.list[lastIndex].isApplicant === 'undefined' && this.areLastExecutorValid(ctx)))) {
                ctx.index = ctx.list.length;
            } else {
                ctx.index = lastIndex;
            }
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

    areLastExecutorValid(ctx) {
        const lastIndex = ctx.list.length - 1;
        const executor = ctx.list[lastIndex];
        return executor &&
            executor.fullName &&
            executor.childAdoptedIn &&
            executor.email &&
            executor.address;
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

    handlePost(ctx, errors) {
        if (ctx.coApplicantRelationshipToDeceased === 'optionChild' || ctx.coApplicantRelationshipToDeceased === 'optionGrandchild') {
            ctx.list[ctx.index] = {
                ...ctx.list[ctx.index],
                coApplicantRelationshipToDeceased: ctx.coApplicantRelationshipToDeceased,
                isApplying: true
            };
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
