'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const ExecutorsWrapper = require('app/wrappers/Executors');
const pageUrl = '/parent-adopted-in';

// Relationship-to-field map allows the same step to persist either legacy or WB/HB parent fields.
const PARENT_ADOPTION_FIELDS_BY_RELATIONSHIP = {
    optionGrandchild: {
        adoptedIn: 'grandchildParentAdoptedIn',
        adoptionPlace: 'grandchildParentAdoptionInEnglandOrWales',
        adoptedOut: 'grandchildParentAdoptedOut'
    },
    grandchild: {
        adoptedIn: 'grandchildParentAdoptedIn',
        adoptionPlace: 'grandchildParentAdoptionInEnglandOrWales',
        adoptedOut: 'grandchildParentAdoptedOut'
    },
    optionHalfBloodNieceOrNephew: {
        adoptedIn: 'halfNieceOrNephewParentAdoptedIn',
        adoptionPlace: 'halfNieceOrNephewParentAdoptionInEnglandOrWales',
        adoptedOut: 'halfNieceOrNephewParentAdoptedOut'
    },
    halfBloodNieceOrNephew: {
        adoptedIn: 'halfNieceOrNephewParentAdoptedIn',
        adoptionPlace: 'halfNieceOrNephewParentAdoptionInEnglandOrWales',
        adoptedOut: 'halfNieceOrNephewParentAdoptedOut'
    },
    optionWholeBloodNieceOrNephew: {
        adoptedIn: 'wholeNieceOrNephewParentAdoptedIn',
        adoptionPlace: 'wholeNieceOrNephewParentAdoptionInEnglandOrWales',
        adoptedOut: 'wholeNieceOrNephewParentAdoptedOut'
    },
    wholeBloodNieceOrNephew: {
        adoptedIn: 'wholeNieceOrNephewParentAdoptedIn',
        adoptionPlace: 'wholeNieceOrNephewParentAdoptionInEnglandOrWales',
        adoptedOut: 'wholeNieceOrNephewParentAdoptedOut'
    }
};

function parentAdoptionFieldsFor(relationship) {
    return PARENT_ADOPTION_FIELDS_BY_RELATIONSHIP[relationship] || {
        adoptedIn: null,
        adoptionPlace: null,
        adoptedOut: null
    };
}

function relationshipFor(ctx) {
    return ctx?.relationshipToDeceased ?? ctx?.list?.[ctx?.index]?.coApplicantRelationshipToDeceased ?? null;
}

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
        const relationship = ctx.list?.[ctx.index]?.coApplicantRelationshipToDeceased;
        const {adoptedIn} = parentAdoptionFieldsFor(relationship);
        if (adoptedIn && ctx.list[ctx.index]?.[adoptedIn]) {
            return [true, 'inProgress'];
        }
        return [false, 'inProgress'];
    }

    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            const relationship = ctx.list?.[ctx.index]?.coApplicantRelationshipToDeceased;
            const {adoptedIn} = parentAdoptionFieldsFor(relationship);
            ctx.applicantParentAdoptedIn = ctx.list[ctx.index][adoptedIn];
        }
        return [ctx];
    }

    nextStepOptions(ctx) {
        const coapplParentAdoptedIn = ctx.applicantParentAdoptedIn;
        const relationship = ctx.list?.at(ctx.index)?.coApplicantRelationshipToDeceased;
        const isWhole = relationship === 'optionWholeBloodNieceOrNephew' || relationship === 'wholeBloodNieceOrNephew';
        const isHalf = relationship === 'optionHalfBloodNieceOrNephew' || relationship === 'halfBloodNieceOrNephew';
        const isNieceOrNephew = isWhole || isHalf;
        ctx.wholeBloodNieceOrNephewParentAdoptedIn = isWhole && coapplParentAdoptedIn === 'optionYes';
        ctx.halfBloodNieceOrNephewParentAdoptedIn = isHalf && coapplParentAdoptedIn === 'optionYes';
        ctx.parentAdopted = !isNieceOrNephew && coapplParentAdoptedIn === 'optionYes';
        return {
            options: [
                {key: 'wholeBloodNieceOrNephewParentAdoptedIn', value: true, choice: 'wholeBloodNieceOrNephewParentAdoptedIn'},
                {key: 'halfBloodNieceOrNephewParentAdoptedIn', value: true, choice: 'halfBloodNieceOrNephewParentAdoptedIn'},
                {key: 'parentAdopted', value: true, choice: 'parentAdoptedIn'},
            ]
        };
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        const relationship = relationshipFor(ctx);
        const fieldError = errors?.[0];
        const errorKey = this.requiredErrorKeyForRelationship(relationship);
        this.i18next.changeLanguage(language);
        const errorPath = `${this.resourcePath.replace(/\//g, '.')}.errors.applicantParentAdoptedIn.${errorKey}`;
        const dynamicRequiredMessage = this.i18next.t(errorPath);

        if (fieldError && dynamicRequiredMessage) {
            fieldError.msg = dynamicRequiredMessage;
        }

        if (fields.deceasedName && fieldError) {
            fieldError.msg = fieldError.msg
                .replace('{deceasedName}', fields.deceasedName.value)
                .replace('{applicantName}', fields.applicantName?.value || '');
            // Keep inline and summary error messages aligned after dynamic replacement.
            if (fields.applicantParentAdoptedIn) {
                fields.applicantParentAdoptedIn.errorMessage = fieldError.msg;
            }
        }
        return fields;
    }

    requiredErrorKeyForRelationship(relationship) {
        if (relationship === 'optionWholeBloodNieceOrNephew' || relationship === 'wholeBloodNieceOrNephew') {
            return 'wholeBloodNieceOrNephewRequired';
        }
        if (relationship === 'optionHalfBloodNieceOrNephew' || relationship === 'halfBloodNieceOrNephew') {
            return 'halfBloodNieceOrNephewRequired';
        }
        return 'required';
    }

    handlePost(ctx, errors, formdata) {
        const relationship = ctx.list?.[ctx.index]?.coApplicantRelationshipToDeceased;
        const {adoptedIn, adoptionPlace, adoptedOut} = parentAdoptionFieldsFor(relationship);
        // Clear dependent answers when adopted-in flips to avoid stale branch data on summary/persistence.
        if (formdata.executors && formdata.executors.list && adoptedIn && ctx.applicantParentAdoptedIn !== formdata.executors.list[ctx.index]?.[adoptedIn]) {
            delete ctx.list[ctx.index][adoptionPlace];
            delete ctx.list[ctx.index][adoptedOut];
        }
        if (adoptedIn) {
            ctx.list[ctx.index][adoptedIn] = ctx.applicantParentAdoptedIn;
        }
        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        // Keep route-only flags out of persisted executor payload.
        delete ctx.wholeBloodNieceOrNephewParentAdoptedIn;
        delete ctx.halfBloodNieceOrNephewParentAdoptedIn;
        delete ctx.parentAdopted;
        delete ctx.deceasedName;
        delete ctx.applicantName;
        return [ctx, formdata];
    }

}

module.exports = CoApplicantParentAdoptedIn;
