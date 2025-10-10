'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const pageUrl = '/coapplicant-adoption-place';
const {findIndex} = require('lodash');

class CoApplicantAdoptionPlace extends ValidationStep {

    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
    }

    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            ctx.adoptionPlace = ctx.list[ctx.index].childAdoptionInEnglandOrWales;
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

    nextStepUrl(req, ctx) {
        if (ctx.adoptionPlace === 'optionYes') {
            return `/parent-adopted-in/${ctx.index}`;
        }
        return this.next(req, ctx).constructor.getUrl('ParentAdoptedIn');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'adoptionPlace', value: 'optionYes', choice: 'ParentAdoptedIn'},
            ]
        };
    }

    handlePost(ctx, errors, formdata) {
        if (ctx.list[ctx.index].coApplicantRelationshipToDeceased==='optionChild') {
            formdata.coApplicants.list[ctx.index].childAdoptionInEnglandOrWales=ctx.adoptionPlace;
        }
        if (ctx.list[ctx.index].coApplicantRelationshipToDeceased==='optionGrandchild') {
            formdata.coApplicants.list[ctx.index].grandchildAdoptionInEnglandOrWales=ctx.adoptionPlace;
        }
        return [ctx, errors];
    }
}

module.exports = CoApplicantAdoptionPlace;
