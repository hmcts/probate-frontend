'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');
const ExecutorsWrapper = require('../../../../wrappers/Executors');
const pageUrl = '/parent-die-before';

class ParentDieBefore extends ValidationStep {

    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
    }

    handleGet(ctx) {
        const executor = ctx.list?.[ctx.index];
        const field = this.parentDieBeforeField(ctx);
        if (executor && field) {
            ctx.applicantParentDieBeforeDeceased = executor[field];
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
        ctx.relationshipToDeceased = ctx.list?.[ctx.index]?.coApplicantRelationshipToDeceased;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }
    isComplete(ctx) {
        const parentDieBeforeField = this.parentDieBeforeField(ctx);
        const selectedAnswer = parentDieBeforeField && ctx.list?.[ctx.index]?.[parentDieBeforeField];
        if (typeof selectedAnswer !== 'undefined') {
            return [selectedAnswer === 'optionYes', 'inProgress'];
        }
        return [false, 'inProgress'];
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).getUrlWithContext(ctx, 'otherCoApplicantRelationship');
    }

    nextStepOptions(ctx) {
        const relationship = ctx.list?.[ctx.index]?.coApplicantRelationshipToDeceased;
        const parentDieBeforeField = this.parentDieBeforeField(ctx);
        const selectedAnswer = ctx.applicantParentDieBeforeDeceased ?? ctx.list?.[ctx.index]?.[parentDieBeforeField];
        const parentDiedBefore = selectedAnswer === 'optionYes';
        const isWhole = relationship === 'optionWholeBloodNieceOrNephew';
        const isHalf = relationship === 'optionHalfBloodNieceOrNephew';
        const isNieceOrNephew = isWhole || isHalf;
        ctx.wholeBloodNieceOrNephewParentDieBefore = isWhole && parentDiedBefore;
        ctx.halfBloodNieceOrNephewParentDieBefore = isHalf && parentDiedBefore;
        ctx.parentDieBeforeDeceased = !isNieceOrNephew && parentDiedBefore;
        return {
            options: [
                {key: 'wholeBloodNieceOrNephewParentDieBefore', value: true, choice: 'wholeBloodNieceOrNephewParentDieBefore'},
                {key: 'halfBloodNieceOrNephewParentDieBefore', value: true, choice: 'halfBloodNieceOrNephewParentDieBefore'},
                {key: 'parentDieBeforeDeceased', value: true, choice: 'parentDieBefore'},
            ]
        };
    }

    handlePost(ctx, errors) {
        const relationship = ctx.list?.[ctx.index]?.coApplicantRelationshipToDeceased;
        const parentDieBeforeField = this.parentDieBeforeField(ctx);
        if (parentDieBeforeField) {
            ctx.list[ctx.index][parentDieBeforeField] = ctx.applicantParentDieBeforeDeceased;
        }

        const parentAdoptionFields = relationship === 'optionWholeBloodNieceOrNephew'
            ? ['wholeNieceOrNephewParentAdoptedIn', 'wholeNieceOrNephewParentAdoptionInEnglandOrWales', 'wholeNieceOrNephewParentAdoptedOut']
            : relationship === 'optionHalfBloodNieceOrNephew'
                ? ['halfNieceOrNephewParentAdoptedIn', 'halfNieceOrNephewParentAdoptionInEnglandOrWales', 'halfNieceOrNephewParentAdoptedOut']
                : null;
        // If parent did not predecease, downstream adoption questions are no longer relevant for this branch.
        if (parentAdoptionFields && ctx.applicantParentDieBeforeDeceased === 'optionNo') {
            parentAdoptionFields.forEach(field => {
                delete ctx.list[ctx.index][field];
            });
        }

        if (ctx.applicantParentDieBeforeDeceased === 'optionNo') {
            ctx.hasCoApplicant = 'optionYes';
        }
        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        // Keep route-only flags out of persisted executor payload.
        delete ctx.wholeBloodNieceOrNephewParentDieBefore;
        delete ctx.halfBloodNieceOrNephewParentDieBefore;
        delete ctx.parentDieBeforeDeceased;
        delete ctx.deceasedName;
        return [ctx, formdata];
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        const relationship = ctx?.relationshipToDeceased ?? ctx?.list?.[ctx?.index]?.coApplicantRelationshipToDeceased ?? null;
        const fieldError = errors?.[0];
        const errorKey = this.requiredErrorKeyForRelationship(relationship);
        const dynamicRequiredMessage = this.generateContent(ctx, {}, language)
            ?.errors?.applicantParentDieBeforeDeceased?.[errorKey];

        if (fieldError && dynamicRequiredMessage) {
            fieldError.msg = dynamicRequiredMessage;
        }

        if (fields.deceasedName && fieldError) {
            fieldError.msg = fieldError.msg.replace('{deceasedName}', fields.deceasedName.value);
            // Keep inline and summary error messages aligned when we inject relationship-specific copy.
            if (fields.applicantParentDieBeforeDeceased) {
                fields.applicantParentDieBeforeDeceased.errorMessage = fieldError.msg;
            }
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

    parentDieBeforeField(ctx) {
        const relationship = ctx.list?.[ctx.index]?.coApplicantRelationshipToDeceased;
        if (relationship === 'optionGrandchild') {
            return 'childDieBeforeDeceased';
        }
        if (relationship === 'optionHalfBloodNieceOrNephew') {
            return 'halfNieceOrNephewParentDieBeforeDeceased';
        }
        if (relationship === 'optionWholeBloodNieceOrNephew') {
            return 'wholeNieceOrNephewParentDieBeforeDeceased';
        }
        return null;
    }

}

module.exports = ParentDieBefore;
