'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const pageUrl = '/coapplicant-adopted-out';
const {findIndex} = require('lodash');

class CoApplicantAdoptedOut extends ValidationStep {

    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
    }

    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            ctx.adoptedOut = ctx.list[ctx.index].childAdoptedOut;
        }
        return [ctx];
    }

    getContextData(req) {
        const formdata = req.session.form;
        const ctx = super.getContextData(req);
        ctx.list = formdata.coApplicants?.list || [];
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
        if (ctx.adoptedOut === 'optionNo') {
            return `/parent-adopted-in/${ctx.index}`;
        }
        return this.next(req, ctx).constructor.getUrl('adoptedOut');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'AdoptedOut', value: 'optionNo', choice: 'notAdoptedOut'},
            ]
        };
    }

    handlePost(ctx, errors, formdata) {
        if (ctx.list[ctx.index].coApplicantRelationshipToDeceased==='optionChild') {
            formdata.coApplicants.list[ctx.index].childAdoptedOut=ctx.adoptedOut;
        }
        if (ctx.list[ctx.index].coApplicantRelationshipToDeceased==='optionGrandchild') {
            formdata.coApplicants.list[ctx.index].grandchildAdoptedOut=ctx.adoptedOut;
        }
        return [ctx, errors];
    }
}

module.exports = CoApplicantAdoptedOut;
