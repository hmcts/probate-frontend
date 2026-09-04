'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const ExecutorsWrapper = require('../../../../wrappers/Executors');
const pageUrl = '/parent-adopted-out';

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
            return this.next(req, ctx).getUrlWithContext(ctx, 'coApplicantParentAdoptedOutWholeBloodNoNameStop');
        }
        if (relationship === 'optionHalfBloodNieceOrNephew') {
            return this.next(req, ctx).getUrlWithContext(ctx, 'coApplicantParentAdoptedOutHalfBloodNoNameStop');
        }
        return this.next(req, ctx).getUrlWithContext(ctx, 'coApplicantParentAdoptedOutStop');
    }

    nextStepOptions(ctx) {
        const relationship = ctx.list?.[ctx.index]?.coApplicantRelationshipToDeceased;
        const parentNotAdoptedOut = ctx.applicantParentAdoptedOut === 'optionNo';
        const isWhole = relationship === 'optionWholeBloodNieceOrNephew';
        const isHalf = relationship === 'optionHalfBloodNieceOrNephew';
        const isNieceOrNephew = isWhole || isHalf;
        ctx.wholeBloodNieceOrNephewParentNotAdoptedOut = isWhole && parentNotAdoptedOut;
        ctx.halfBloodNieceOrNephewParentNotAdoptedOut = isHalf && parentNotAdoptedOut;
        ctx.parentNotAdoptedOut = !isNieceOrNephew && parentNotAdoptedOut;
        return {
            options: [
                {key: 'wholeBloodNieceOrNephewParentNotAdoptedOut', value: true, choice: 'wholeBloodNieceOrNephewParentNotAdoptedOut'},
                {key: 'halfBloodNieceOrNephewParentNotAdoptedOut', value: true, choice: 'halfBloodNieceOrNephewParentNotAdoptedOut'},
                {key: 'parentNotAdoptedOut', value: true, choice: 'parentNotAdoptedOut'},
            ]
        };
    }
    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        const relationship = ctx?.relationshipToDeceased ?? ctx?.list?.[ctx?.index]?.coApplicantRelationshipToDeceased ?? null;
        const fieldError = errors?.[0];
        const errorKey = this.requiredErrorKeyForRelationship(relationship);
        const parentAdoptedOutField = fields.applicantParentAdoptedOut || null;
        const fieldNameForErrors = parentAdoptedOutField ? 'applicantParentAdoptedOut' : 'adoptedOut';
        this.i18next.changeLanguage(language);
        const errorPath = `${this.resourcePath.replace(/\//g, '.')}.errors.${fieldNameForErrors}.${errorKey}`;
        const dynamicRequiredMessage = this.i18next.t(errorPath);

        if (fieldError && dynamicRequiredMessage) {
            fieldError.msg = dynamicRequiredMessage;
        }

        if (parentAdoptedOutField && fields.deceasedName && fieldError) {
            fieldError.msg = fieldError.msg
                .replace('{deceasedName}', fields.deceasedName.value)
                .replace('{applicantName}', fields.applicantName?.value || '');
            // Keep inline and summary error messages aligned after dynamic replacement.
            parentAdoptedOutField.errorMessage = fieldError.msg;
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

    action(ctx, formdata) {
        super.action(ctx, formdata);
        // Keep route-only flags out of persisted executor payload.
        delete ctx.wholeBloodNieceOrNephewParentNotAdoptedOut;
        delete ctx.halfBloodNieceOrNephewParentNotAdoptedOut;
        delete ctx.parentNotAdoptedOut;
        delete ctx.deceasedName;
        delete ctx.applicantName;
        return [ctx, formdata];
    }

    parentAdoptedOutField(ctx) {
        const relationship = ctx.list?.[ctx.index]?.coApplicantRelationshipToDeceased;
        if (relationship === 'optionGrandchild') {
            return 'grandchildParentAdoptedOut';
        }
        if (relationship === 'optionHalfBloodNieceOrNephew') {
            return 'halfNieceOrNephewParentAdoptedOut';
        }
        if (relationship === 'optionWholeBloodNieceOrNephew') {
            return 'wholeNieceOrNephewParentAdoptedOut';
        }
        return null;
    }
}

module.exports = CoApplicantParentAdoptedOut;
