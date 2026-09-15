'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class AdoptionPlace extends ValidationStep {

    static getUrl() {
        return '/adopted-in-england-or-wales';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.relationshipToDeceased = formdata.applicant?.relationshipToDeceased;
        ctx.details = formdata.details || {};
        return ctx;
    }

    nextStepUrl(req, ctx) {
        if (ctx.relationshipToDeceased === 'optionSibling') {
            return this.next(req, ctx).getUrlWithContext(ctx, 'adoptionNotInEnglandOrWales');
        }
        return this.next(req, ctx).getUrlWithContext(ctx, 'adoptionNotEnglandOrWales');
    }

    nextStepOptions(ctx) {
        ctx.childOrGrandChildAdoptedInEnglandOrWales = (ctx.relationshipToDeceased === 'optionChild' || ctx.relationshipToDeceased === 'optionGrandchild') && ctx.adoptionPlace === 'optionYes';
        ctx.siblingAdoptedInEnglandOrWales = ctx.relationshipToDeceased === 'optionSibling' && ctx.adoptionPlace === 'optionYes';
        return {
            options: [
                {key: 'childOrGrandChildAdoptedInEnglandOrWales', value: true, choice: 'childOrGrandChildAdoptedInEnglandOrWales'},
                {key: 'siblingAdoptedInEnglandOrWales', value: true, choice: 'siblingAdoptedInEnglandOrWales'}
            ]
        };
    }
}

module.exports = AdoptionPlace;
