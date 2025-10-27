'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class PlaceOfAdoption extends ValidationStep {

    static getUrl() {
        return '/adopted-in-england-or-wales';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.relationshipToDeceased = formdata.applicant && formdata.applicant.relationshipToDeceased;
        ctx.details = formdata.details || {};
        return ctx;
    }

    handleGet(ctx) {
        if (ctx.relationshipToDeceased === 'optionGrandchild') {
            ctx.adoptionPlace = ctx.details?.grandchildParentAdoptionInEnglandOrWales;
        } else {
            ctx.adoptionPlace = ctx.details?.childAdoptionInEnglandOrWales;
        }
        return [ctx];
    }

    handlePost(ctx, errors) {
        if (ctx.relationshipToDeceased === 'optionGrandchild') {
            ctx.grandchildParentAdoptionPlace = ctx.adoptionPlace;
        } else if (ctx.relationshipToDeceased === 'optionChild') {
            ctx.childAdoptionPlace = ctx.adoptionPlace;
        }
        return [ctx, errors];
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('adoptionNotEnglandOrWales');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'adoptionPlace', value: 'optionYes', choice: 'adoptedInEnglandOrWales'}
            ]
        };
    }
}

module.exports = PlaceOfAdoption;
