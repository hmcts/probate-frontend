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
        if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
        } else {
            ctx.index = this.recalcIndex(ctx, 0);
            ctx.redirect = `${pageUrl}/${ctx.index}`;
        }
        ctx.deceasedName = FormatName.format(formdata.deceased);
        ctx.applicantName = ctx.list?.[ctx.index]?.fullName;
        return ctx;
    }

    recalcIndex(ctx, index) {
        return findIndex(ctx.list, o => o.isApplying === true, index + 1);
    }

    nextStepUrl(req, ctx) {
        if (ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionChild' && ctx.adoptionPlace === 'optionYes') {
            return `/coapplicant-email/${ctx.index}`;
        } else if (ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionGrandchild' && ctx.adoptionPlace === 'optionYes') {
            return `/parent-adopted-in/${ctx.index}`;
        }
        return this.next(req, ctx).constructor.getUrl('coApplicantAdoptionPlaceStop');
    }

    nextStepOptions(ctx) {
        ctx.childAdoptedInEnglandOrWales = ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionChild' && ctx.adoptionPlace === 'optionYes';
        ctx.grandChildAdoptedInEnglandOrWales = ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionGrandchild' && ctx.adoptionPlace === 'optionYes';
        return {
            options: [
                {key: 'childAdoptedInEnglandOrWales', value: true, choice: 'childAdoptedInEnglandOrWales'},
                {key: 'grandChildAdoptedInEnglandOrWales', value: true, choice: 'grandChildAdoptedInEnglandOrWales'},
            ]
        };
    }

    handlePost(ctx, errors, formdata) {
        if (ctx.list[ctx.index].coApplicantRelationshipToDeceased ==='optionChild') {
            formdata.executors.list[ctx.index].childAdoptionInEnglandOrWales=ctx.adoptionPlace;
        }
        if (ctx.list[ctx.index].coApplicantRelationshipToDeceased ==='optionGrandchild') {
            formdata.executors.list[ctx.index].grandchildAdoptionInEnglandOrWales=ctx.adoptionPlace;
        }
        return [ctx, errors];
    }
}

module.exports = CoApplicantAdoptionPlace;
