'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const ExecutorsWrapper = require('app/wrappers/Executors');
const pageUrl = '/parent-adopted-in';
const PARENT_ADOPTED_IN_FIELDS = {
    optionGrandchild: 'grandchildParentAdoptedIn',
    optionHalfBloodNieceOrNephew: 'halfBloodNieceOrNephewAdoptedIn',
    optionWholeBloodNieceOrNephew: 'wholeBloodNieceOrNephewAdoptedIn'
};
const PARENT_ADOPTION_PLACE_FIELDS = {
    optionGrandchild: 'grandchildParentAdoptionInEnglandOrWales',
    optionHalfBloodNieceOrNephew: 'halfBloodNieceOrNephewAdoptionInEnglandOrWales',
    optionWholeBloodNieceOrNephew: 'wholeBloodNieceOrNephewAdoptionInEnglandOrWales'
};
const PARENT_ADOPTED_OUT_FIELDS = {
    optionGrandchild: 'grandchildParentAdoptedOut',
    optionHalfBloodNieceOrNephew: 'halfBloodNieceOrNephewAdoptedOut',
    optionWholeBloodNieceOrNephew: 'wholeBloodNieceOrNephewAdoptedOut'
};
const PARENT_ADOPTED_IN_FIELD_NAMES = Object.values(PARENT_ADOPTED_IN_FIELDS);

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
        const adoptedInField = this.parentAdoptedInField(ctx);
        const answer = ctx.applicantParentAdoptedIn || (adoptedInField && ctx.list?.[ctx.index]?.[adoptedInField]) || this.savedParentAdoptedInAnswer(ctx);
        const relationship = ctx.list?.at(ctx.index)?.coApplicantRelationshipToDeceased;
        const isNieceOrNephew = relationship === 'optionWholeBloodNieceOrNephew' || relationship === 'optionHalfBloodNieceOrNephew';
        ctx.wholeBloodNieceOrNephewParentAdoptedIn = relationship === 'optionWholeBloodNieceOrNephew' && answer === 'optionYes';
        ctx.wholeBloodNieceOrNephewParentNotAdoptedIn = relationship === 'optionWholeBloodNieceOrNephew' && answer === 'optionNo';
        ctx.halfBloodNieceOrNephewParentAdoptedIn = relationship === 'optionHalfBloodNieceOrNephew' && answer === 'optionYes';
        ctx.halfBloodNieceOrNephewParentNotAdoptedIn = relationship === 'optionHalfBloodNieceOrNephew' && answer === 'optionNo';
        ctx.parentAdopted = !isNieceOrNephew && answer === 'optionYes';
        ctx.parentNotAdopted = !isNieceOrNephew && answer === 'optionNo';
        return {
            options: [
                {key: 'wholeBloodNieceOrNephewParentAdoptedIn', value: true, choice: 'wholeBloodNieceOrNephewParentAdoptedIn'},
                {key: 'wholeBloodNieceOrNephewParentNotAdoptedIn', value: true, choice: 'wholeBloodNieceOrNephewParentNotAdoptedIn'},
                {key: 'halfBloodNieceOrNephewParentAdoptedIn', value: true, choice: 'halfBloodNieceOrNephewParentAdoptedIn'},
                {key: 'halfBloodNieceOrNephewParentNotAdoptedIn', value: true, choice: 'halfBloodNieceOrNephewParentNotAdoptedIn'},
                {key: 'parentAdopted', value: true, choice: 'parentAdoptedIn'},
                {key: 'parentNotAdopted', value: true, choice: 'parentNotAdoptedIn'},
            ]
        };
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        const relationship = ctx.relationshipToDeceased || ctx.list?.[ctx.index]?.coApplicantRelationshipToDeceased;
        const errorKey = this.requiredErrorKeyForRelationship(relationship);
        this.i18next.changeLanguage(language);
        const errorPath = `${this.resourcePath.replace(/\//g, '.')}.errors.applicantParentAdoptedIn.${errorKey}`;
        const dynamicRequiredMessage = this.i18next.t(errorPath);

        if (errors?.[0] && dynamicRequiredMessage) {
            errors[0].msg = dynamicRequiredMessage;
        }

        if (fields.deceasedName && errors?.[0]) {
            errors[0].msg = errors[0].msg
                .replace('{deceasedName}', fields.deceasedName.value)
                .replace('{applicantName}', fields.applicantName?.value || '');
            // Keep inline and summary error messages aligned after dynamic replacement.
            fields.applicantParentAdoptedIn.errorMessage = errors[0].msg;
        }
        return fields;
    }

    requiredErrorKeyForRelationship(relationship) {
        if (relationship === 'optionWholeBloodNieceOrNephew') {
            return 'wholeBloodNieceOrNephewRequired';
        }
        if (relationship === 'optionHalfBloodNieceOrNephew') {
            return 'halfBloodNieceOrNephewRequired';
        }
        return 'required';
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
        delete ctx.wholeBloodNieceOrNephewParentNotAdoptedIn;
        delete ctx.halfBloodNieceOrNephewParentAdoptedIn;
        delete ctx.halfBloodNieceOrNephewParentNotAdoptedIn;
        delete ctx.parentAdopted;
        delete ctx.parentNotAdopted;
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

    savedParentAdoptedInAnswer(ctx) {
        const executor = ctx.list?.[ctx.index];
        const fieldName = PARENT_ADOPTED_IN_FIELD_NAMES.find(field => executor?.[field]);
        return fieldName ? executor[fieldName] : null;
    }
}

module.exports = CoApplicantParentAdoptedIn;
