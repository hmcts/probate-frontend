'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const FieldError = require('../../../../components/error');
const {get} = require('lodash');

class ChildAdoptedIn extends ValidationStep {

    static getUrl() {
        return '/child-adopted-in';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        ctx.relationshipToDeceased = formdata.applicant && formdata.applicant.relationshipToDeceased;
        ctx.details = formdata.details || {};
        return ctx;
    }
    handleGet(ctx) {
        if (ctx.relationshipToDeceased === 'optionGrandchild') {
            ctx.adoptedIn = ctx.details?.grandchildParentAdoptedIn;
        } else {
            ctx.adoptedIn = ctx.details?.childAdoptedIn;
        }
        return [ctx];
    }
    nextStepOptions() {
        return {
            options: [
                {key: 'adoptedIn', value: 'optionYes', choice: 'childAdoptedIn'},
                {key: 'adoptedIn', value: 'optionNo', choice: 'childNotAdoptedIn'},
            ]
        };
    }

    handlePost(ctx, errors, formdata, session) {
        const applicant = formdata.applicant;
        ctx.relationshipToDeceased = applicant && applicant.relationshipToDeceased;
        const isSaveAndClose = typeof get(ctx, 'isSaveAndClose') !== 'undefined' && get(ctx, 'isSaveAndClose') === 'true';
        if (!isSaveAndClose) {
            if (typeof ctx.adoptedIn === 'undefined' || !ctx.adoptedIn) {
                if (ctx.relationshipToDeceased === 'optionChild') {
                    errors.push(this.generateDynamicErrorMessage('adoptedIn', 'requiredChild', session, ctx.deceasedName));
                } else if (ctx.relationshipToDeceased === 'optionGrandchild') {
                    errors.push(this.generateDynamicErrorMessage('adoptedIn', 'requiredGrandchild', session, ctx.deceasedName));
                }
            } else if (ctx.relationshipToDeceased === 'optionGrandchild') {
                ctx.grandchildParentAdoptedIn = ctx.adoptedIn;
            } else if (ctx.relationshipToDeceased === 'optionChild') {
                ctx.childAdoptedIn = ctx.adoptedIn;
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

module.exports = ChildAdoptedIn;
