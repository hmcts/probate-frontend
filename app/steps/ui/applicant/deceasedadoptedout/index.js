'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const {get} = require('lodash');
const FieldError = require('../../../../components/error');

class DeceasedAdoptedOut extends ValidationStep {

    static getUrl() {
        return '/parent-adopted-deceased-out';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        ctx.relationship = ctx.relationshipToDeceased;
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
        return this.next(req, ctx).constructor.getUrl('deceasedAdoptedOut');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'deceasedAdoptedOut', value: 'optionNo', choice: 'deceasedNotAdoptedOut'},
            ]
        };
    }

    generateDynamicErrorMessage(field, keyword, session, deceasedName) {
        const baseMessage = FieldError(field, keyword, this.resourcePath, this.generateContent({}, {}, session.language), session.language);
        baseMessage.msg = baseMessage.msg.replace('{deceasedName}', deceasedName);
        return baseMessage;
    }

    handlePost(ctx, errors, formdata, session) {
        const isSaveAndClose = typeof get(ctx, 'isSaveAndClose') !== 'undefined' && get(ctx, 'isSaveAndClose') === 'true';
        if (!isSaveAndClose) {
            if (typeof ctx.deceasedAdoptedOut === 'undefined' || !ctx.deceasedAdoptedOut) {
                if (ctx.relationshipToDeceased === 'optionParent') {
                    errors.push(this.generateDynamicErrorMessage('deceasedAdoptedOut', 'requiredParent', session, ctx.deceasedName));
                } else if (ctx.relationshipToDeceased === 'optionSibling') {
                    errors.push(this.generateDynamicErrorMessage('deceasedAdoptedOut', 'requiredSibling', session, ctx.deceasedName));
                }
            }
        }
        return [ctx, errors];
    }
}

module.exports = DeceasedAdoptedOut;
