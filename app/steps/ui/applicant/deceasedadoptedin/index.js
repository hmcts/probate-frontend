'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const {get} = require('lodash');
const FieldError = require('../../../../components/error');

class DeceasedAdoptedIn extends ValidationStep {

    static getUrl() {
        return '/deceased-adopted-in';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        ctx.relationship = ctx.relationshipToDeceased;
        return ctx;
    }
    nextStepOptions() {
        return {
            options: [
                {key: 'deceasedAdoptedIn', value: 'optionYes', choice: 'deceasedAdoptedIn'},
                {key: 'deceasedAdoptedIn', value: 'optionNo', choice: 'deceasedNotAdoptedIn'},
            ]
        };
    }

    handlePost(ctx, errors, formdata, session) {
        const isSaveAndClose = typeof get(ctx, 'isSaveAndClose') !== 'undefined' && get(ctx, 'isSaveAndClose') === 'true';
        if (!isSaveAndClose) {
            if (typeof ctx.deceasedAdoptedIn === 'undefined' || !ctx.deceasedAdoptedIn) {
                if (ctx.relationshipToDeceased === 'optionParent') {
                    errors.push(this.generateDynamicErrorMessage('deceasedAdoptedIn', 'requiredParent', session, ctx.deceasedName));
                } else if (ctx.relationshipToDeceased === 'optionSibling') {
                    errors.push(this.generateDynamicErrorMessage('deceasedAdoptedIn', 'requiredSibling', session, ctx.deceasedName));
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

module.exports = DeceasedAdoptedIn;
