'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class AdoptionPlace extends ValidationStep {

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

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('adoptionNotEnglandOrWales');
    }

    nextStepOptions(ctx) {
        ctx.applicantAdoptedInEnglandOrWales = (ctx.relationshipToDeceased === 'optionChild' || ctx.relationshipToDeceased === 'optionGrandchild') && ctx.adoptionPlace === 'optionYes';
        return {
            options: [
                {key: 'applicantAdoptedInEnglandOrWales', value: true, choice: 'applicantAdoptedInEnglandOrWales'}
            ]
        };
    }
}

module.exports = AdoptionPlace;
