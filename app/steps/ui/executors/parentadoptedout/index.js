'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const ExecutorsWrapper = require('../../../../wrappers/Executors');
const pageUrl = '/parent-adopted-out';
const PARENT_ADOPTED_OUT_FIELDS = {
    optionGrandchild: 'grandchildParentAdoptedOut',
    optionWholeBloodNieceOrNephew: 'wholeBloodNieceOrNephewParentAdoptedOut'
};

class CoApplicantParentAdoptedOut extends ValidationStep {

    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
    }

    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            const adoptedOutField = this.parentAdoptedOutField(ctx);
            ctx.applicantParentAdoptedOut = ctx.list[ctx.index][adoptedOutField];
        }
        return [ctx];
    }
    getContextData(req) {
        const formdata = req.session.form;
        const ctx = super.getContextData(req);
        if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
        } else {
            const executorsWrapper = new ExecutorsWrapper(formdata.executors);
            ctx.index = executorsWrapper.getNextIndex();
            ctx.redirect = `${pageUrl}/${ctx.index}`;
        }
        ctx.applicantName = ctx.list?.[ctx.index]?.fullName;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        ctx.relationshipToDeceased = ctx.list?.[ctx.index]?.coApplicantRelationshipToDeceased;
        return ctx;
    }
    isComplete(ctx) {
        const adoptedOutField = this.parentAdoptedOutField(ctx);
        const isParentNotAdoptedOut = adoptedOutField && ctx.list[ctx.index]?.[adoptedOutField] === 'optionNo';
        return [isParentNotAdoptedOut, 'inProgress'];
    }

    nextStepUrl(req, ctx) {
        const relationship = ctx.list?.[ctx.index]?.coApplicantRelationshipToDeceased;
        if (relationship === 'optionWholeBloodNieceOrNephew') {
            return this.next(req, ctx).getUrlWithContext(ctx, 'coApplicantParentAdoptedOutNoNameStop');
        }
        return this.next(req, ctx).getUrlWithContext(ctx, 'coApplicantParentAdoptedOutStop');
    }

    nextStepOptions(ctx) {
        const relationship = ctx.list?.[ctx.index]?.coApplicantRelationshipToDeceased;
        const adoptedOutField = this.parentAdoptedOutField(ctx);
        const parentNotAdoptedOut = adoptedOutField && ctx.list[ctx.index]?.[adoptedOutField] === 'optionNo';
        ctx.wholeBloodNieceOrNephewParentNotAdoptedOut = relationship === 'optionWholeBloodNieceOrNephew' && parentNotAdoptedOut;
        ctx.parentNotAdoptedOut = relationship !== 'optionWholeBloodNieceOrNephew' && parentNotAdoptedOut;
        return {
            options: [
                {key: 'wholeBloodNieceOrNephewParentNotAdoptedOut', value: true, choice: 'wholeBloodNieceOrNephewParentNotAdoptedOut'},
                {key: 'parentNotAdoptedOut', value: true, choice: 'parentNotAdoptedOut'},
            ]
        };
    }
    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.deceasedName && errors?.[0]) {
            errors[0].msg = errors[0].msg
                .replace('{deceasedName}', fields.deceasedName.value)
                .replace('{applicantName}', fields.applicantName?.value || '');
        }
        return fields;
    }
    handlePost(ctx, errors, formdata) {
        const adoptedOutField = this.parentAdoptedOutField(ctx);
        if (adoptedOutField) {
            ctx.list[ctx.index][adoptedOutField] = ctx.applicantParentAdoptedOut;
            if (formdata.executors?.list?.[ctx.index]) {
                formdata.executors.list[ctx.index][adoptedOutField] = ctx.applicantParentAdoptedOut;
            }
        }
        if (ctx.applicantParentAdoptedOut === 'optionYes') {
            ctx.hasCoApplicant = 'optionYes';
        }
        return [ctx, errors];
    }

    parentAdoptedOutField(ctx) {
        return PARENT_ADOPTED_OUT_FIELDS[ctx.list?.[ctx.index]?.coApplicantRelationshipToDeceased] || 'grandchildParentAdoptedOut';
    }
}

module.exports = CoApplicantParentAdoptedOut;
