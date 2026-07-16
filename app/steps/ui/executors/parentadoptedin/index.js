'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const ExecutorsWrapper = require('app/wrappers/Executors');
const pageUrl = '/parent-adopted-in';
const PARENT_ADOPTED_IN_FIELDS = {
    optionGrandchild: 'grandchildParentAdoptedIn'
};
const PARENT_ADOPTION_PLACE_FIELDS = {
    optionGrandchild: 'grandchildParentAdoptionInEnglandOrWales'
};
const PARENT_ADOPTED_OUT_FIELDS = {
    optionGrandchild: 'grandchildParentAdoptedOut'
};

class CoApplicantParentAdoptedIn extends ValidationStep {
    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
    }

    getContextData(req) {
        const formData = req.session.form;
        const ctx = super.getContextData(req);
        if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
        } else {
            const executorsWrapper = new ExecutorsWrapper(formData.executors);
            ctx.index = executorsWrapper.getNextIndex();
            ctx.redirect = `${pageUrl}/${ctx.index}`;
        }
        ctx.deceasedName = FormatName.format(formData.deceased);
        ctx.applicantName = ctx.list?.[ctx.index]?.fullName;
        ctx.relationshipToDeceased = ctx.list?.[ctx.index]?.coApplicantRelationshipToDeceased;
        return ctx;
    }
    isComplete(ctx) {
        const adoptedInField = this.parentAdoptedInField(ctx);
        if (adoptedInField && ctx.list[ctx.index]?.[adoptedInField]) {
            return [true, 'inProgress'];
        }
        return [false, 'inProgress'];
    }

    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            const adoptedInField = this.parentAdoptedInField(ctx);
            ctx.applicantParentAdoptedIn = ctx.list[ctx.index][adoptedInField];
        }
        return [ctx];
    }

    nextStepOptions(ctx) {
        const coapplParentAdoptedIn = ctx.applicantParentAdoptedIn;
        const relationship = ctx.list?.at(ctx.index)?.coApplicantRelationshipToDeceased;
        ctx.wholeBloodNieceOrNephewParentAdoptedIn = relationship === 'optionWholeBloodNieceOrNephew' && coapplParentAdoptedIn === 'optionYes';
        ctx.parentAdopted = relationship !== 'optionWholeBloodNieceOrNephew' && coapplParentAdoptedIn === 'optionYes';
        return {
            options: [
                {key: 'wholeBloodNieceOrNephewParentAdoptedIn', value: true, choice: 'wholeBloodNieceOrNephewParentAdoptedIn'},
                {key: 'parentAdopted', value: true, choice: 'parentAdoptedIn'},
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
        const adoptedInField = this.parentAdoptedInField(ctx);
        const adoptionPlaceField = this.parentAdoptionPlaceField(ctx);
        const adoptedOutField = this.parentAdoptedOutField(ctx);
        if (formdata.executors && formdata.executors.list && adoptedInField && ctx.applicantParentAdoptedIn !== formdata.executors.list[ctx.index]?.[adoptedInField]) {
            delete ctx.list[ctx.index][adoptionPlaceField];
            delete ctx.list[ctx.index][adoptedOutField];
        }
        if (adoptedInField) {
            ctx.list[ctx.index][adoptedInField] = ctx.applicantParentAdoptedIn;
        }
        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        // Keep route-only flags out of persisted executor payload.
        delete ctx.wholeBloodNieceOrNephewParentAdoptedIn;
        delete ctx.parentAdopted;
        delete ctx.deceasedName;
        delete ctx.applicantName;
        return [ctx, formdata];
    }

    parentAdoptedInField(ctx) {
        return PARENT_ADOPTED_IN_FIELDS[ctx.list?.[ctx.index]?.coApplicantRelationshipToDeceased] || null;
    }

    parentAdoptionPlaceField(ctx) {
        return PARENT_ADOPTION_PLACE_FIELDS[ctx.list?.[ctx.index]?.coApplicantRelationshipToDeceased] || null;
    }

    parentAdoptedOutField(ctx) {
        return PARENT_ADOPTED_OUT_FIELDS[ctx.list?.[ctx.index]?.coApplicantRelationshipToDeceased] || null;
    }
}

module.exports = CoApplicantParentAdoptedIn;
