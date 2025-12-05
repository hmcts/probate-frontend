'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const FieldError = require('../../../../components/error');
const {get} = require('lodash');

class AdoptedIn extends ValidationStep {

    static getUrl() {
        return '/main-applicant-adopted-in';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        ctx.details = formdata.details || {};
        ctx.sameParents = formdata.applicant.sameParents;
        return ctx;
    }
    nextStepOptions() {
        return {
            options: [
                {key: 'adoptedIn', value: 'optionYes', choice: 'adoptedIn'},
                {key: 'adoptedIn', value: 'optionNo', choice: 'notAdoptedIn'},
            ]
        };
    }

    isComplete(ctx) {
        return [
            ctx.adoptedIn==='optionYes' || ctx.adoptedIn==='optionNo', 'inProgress'
        ];
    }
    handlePost(ctx, errors, formdata, session) {
        const isSaveAndClose = typeof get(ctx, 'isSaveAndClose') !== 'undefined' && get(ctx, 'isSaveAndClose') === 'true';
        if (!isSaveAndClose) {
            if (ctx.adoptedIn === 'undefined' || !ctx.adoptedIn) {
                if (ctx.relationshipToDeceased === 'optionChild') {
                    errors.push(this.generateDynamicErrorMessage('adoptedIn', 'requiredChild', session, ctx.deceasedName));
                } else if (ctx.relationshipToDeceased === 'optionGrandchild') {
                    errors.push(this.generateDynamicErrorMessage('adoptedIn', 'requiredGrandchild', session, ctx.deceasedName));
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

module.exports = AdoptedIn;
