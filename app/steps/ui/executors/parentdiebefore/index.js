'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');
const ExecutorsWrapper = require('../../../../wrappers/Executors');
const pageUrl = '/parent-die-before';
class ParentDieBefore extends ValidationStep {

    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
    }

    getUrlWithContext(ctx) {
        const noCtxUrl = this.constructor.getUrl(ctx?.index);
        if (ctx?.caseType === 'intestacy') {
            return `/intestacy${noCtxUrl}`;
        }
        return noCtxUrl;
    }

    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            if (ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionGrandchild') {
                ctx.applicantParentDieBeforeDeceased = ctx.list[ctx.index].childDieBeforeDeceased;
            } else if (ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionHalfBloodNieceOrNephew') {
                ctx.applicantParentDieBeforeDeceased = ctx.list[ctx.index].halfBloodSiblingDiedBeforeDeceased;
            } else if (ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionWholeBloodNieceOrNephew') {
                ctx.applicantParentDieBeforeDeceased = ctx.list[ctx.index].wholeBloodSiblingDiedBeforeDeceased;
            }
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
        const parentDieBeforeFields = [
            'childDieBeforeDeceased',
            'halfBloodSiblingDiedBeforeDeceased',
            'wholeBloodSiblingDiedBeforeDeceased'
        ];
        const parentDieBefore = parentDieBeforeFields.some(field => ctx.list[ctx.index]?.[field]);
        return [parentDieBefore, 'inProgress'];
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).getUrlWithContext(ctx, 'otherCoApplicantRelationship');
    }

    nextStepOptions(ctx) {
        const parentDieBeforeFields = [
            'childDieBeforeDeceased',
            'halfBloodSiblingDiedBeforeDeceased',
            'wholeBloodSiblingDiedBeforeDeceased'
        ];
        ctx.parentDieBeforeDeceased = ctx.applicantParentDieBeforeDeceased === 'optionYes' ||
            parentDieBeforeFields.some(field => ctx.list[ctx.index]?.[field] === 'optionYes');
        return {
            options: [
                {key: 'parentDieBeforeDeceased', value: true, choice: 'parentDieBefore'},
            ]
        };
    }

    handlePost(ctx, errors) {
        if (ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionGrandchild') {
            ctx.list[ctx.index].childDieBeforeDeceased = ctx.applicantParentDieBeforeDeceased;
        } else if (ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionHalfBloodNieceOrNephew') {
            ctx.list[ctx.index].halfBloodSiblingDiedBeforeDeceased = ctx.applicantParentDieBeforeDeceased;
        } else if (ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionWholeBloodNieceOrNephew') {
            ctx.list[ctx.index].wholeBloodSiblingDiedBeforeDeceased = ctx.applicantParentDieBeforeDeceased;
        }
        return [ctx, errors];
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.deceasedName && errors) {
            errors[0].msg = errors[0].msg.replace('{deceasedName}', fields.deceasedName.value);
        }
        return fields;
    }
}

module.exports = ParentDieBefore;
