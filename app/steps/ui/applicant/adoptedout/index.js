'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const {get} = require('lodash');
const FieldError = require('../../../../components/error');

class AdoptedOut extends ValidationStep {

    static getUrl() {
        return '/adopted-out';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        ctx.relationshipToDeceased = formdata.applicant && formdata.applicant.relationshipToDeceased;
        ctx.details = formdata.details || {};
        return ctx;
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('adoptedOut');
    }

    nextStepOptions(ctx) {
        ctx.applicantNotAdoptedOut = (ctx.relationshipToDeceased === 'optionChild' || ctx.relationshipToDeceased === 'optionGrandchild') && ctx.adoptedOut === 'optionNo';
        return {
            options: [
                {key: 'applicantNotAdoptedOut', value: true, choice: 'applicantNotAdoptedOut'}
            ]
        };
    }

    handlePost(ctx, errors, formdata, session) {
        const isSaveAndClose = typeof get(ctx, 'isSaveAndClose') !== 'undefined' && get(ctx, 'isSaveAndClose') === 'true';
        if (!isSaveAndClose) {
            if (typeof ctx.adoptedOut === 'undefined' || !ctx.adoptedOut) {
                if (ctx.relationshipToDeceased === 'optionChild') {
                    errors.push(this.generateDynamicErrorMessage('adoptedOut', 'requiredChild', session, ctx.deceasedName));
                } else if (ctx.relationshipToDeceased === 'optionGrandchild') {
                    errors.push(this.generateDynamicErrorMessage('adoptedOut', 'requiredGrandchild', session, ctx.deceasedName));
                } else if (ctx.relationshipToDeceased === 'optionSibling') {
                    if (ctx.sameParents === 'optionBothParentsSame') {
                        errors.push(this.generateDynamicErrorMessage('adoptedIn', 'requiredWholeBloodSibling', session, ctx.deceasedName));
                    } else if (ctx.sameParents === 'optionOneParentsSame') {
                        errors.push(this.generateDynamicErrorMessage('adoptedIn', 'requiredHalfBloodSibling', session, ctx.deceasedName));
                    }
                }
            }
        }
        return [ctx, errors];
    }

    generateDynamicErrorMessage(field, keyword, session, deceasedName) {
        const baseMessage = FieldError(field, keyword, this.resourcePath, this.generateContent({}, {}, session.language), session.language);
        baseMessage.msg = baseMessage.msg.replace('{deceasedName}', deceasedName);
        return baseMessage;
    }
}

module.exports = AdoptedOut;
