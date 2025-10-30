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

    nextStepOptions(ctx) {
        ctx.childAndAdoptedInEnglandOrWales = ctx.relationshipToDeceased === 'optionChild' && ctx.adoptionPlace === 'optionYes';
        ctx.grandchildAndAdoptedInEnglandOrWales = ctx.relationshipToDeceased === 'optionGrandchild' && ctx.adoptionPlace === 'optionYes';
        return {
            options: [
                {key: 'childAndAdoptedInEnglandOrWales', value: true, choice: 'childAndAdoptedInEnglandOrWales'},
                {key: 'grandchildAndAdoptedInEnglandOrWales', value: true, choice: 'grandchildAndAdoptedInEnglandOrWales'}
            ]
        };
    }
}

module.exports = PlaceOfAdoption;
