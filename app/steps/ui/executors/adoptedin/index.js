'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const {findIndex} = require('lodash');
const pageUrl = '/coapplicant-adopted-in';

class CoApplicantAdoptedIn extends ValidationStep {

    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
    }

    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            ctx.adoptedIn = ctx.list[ctx.index].childAdoptedIn;
        }
        return [ctx];
    }

    getContextData(req) {
        const formdata = req.session.form;
        const ctx = super.getContextData(req);
        if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
        } else {
            ctx.index = this.recalcIndex(ctx, 0);
            ctx.redirect = `${pageUrl}/${ctx.index}`;
        }
        ctx.deceasedName = FormatName.format(formdata.deceased);
        const applicant = formdata.applicant;
        ctx.applicantName= applicant?.alias ?? FormatName.format(applicant);
        return ctx;
    }

    recalcIndex(ctx, index) {
        return findIndex(ctx.list, o => o.isApplying === true, index + 1);
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.deceasedName && errors) {
            errors[0].msg = errors[0].msg.replace('{deceasedName}', fields.deceasedName.value);
        }
        return fields;
    }

    nextStepUrl(req, ctx) {
        if (ctx.adoptedIn === 'optionYes') {
            return `/coapplicant-adoption-place/${ctx.index}`;
        }
        return `/coapplicant-adopted-out/${ctx.index}`;
    }

    handlePost(ctx, errors, formdata) {
        if (ctx.list[ctx.index].coApplicantRelationshipToDeceased==='optionChild') {
            formdata.executors.list[ctx.index].childAdoptedIn=ctx.adoptedIn;
        }
        if (ctx.list[ctx.index].coApplicantRelationshipToDeceased==='optionGrandchild') {
            formdata.executors.list[ctx.index].grandchildAdoptedIn=ctx.adoptedIn;
        }
        return [ctx, errors];
    }
}

module.exports = CoApplicantAdoptedIn;
