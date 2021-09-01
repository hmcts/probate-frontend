'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const {get} = require('lodash');

class AdoptionPlace extends ValidationStep {

    static getUrl() {
        return '/adoption-place*';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedMaritalStatus = get(formdata, 'deceased.maritalStatus');
        return ctx;
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('adoptionNotEnglandOrWales');
    }

    nextStepOptions(ctx) {
        ctx.inEnglandOrWalesDeceasedMarried = ctx.adoptionPlace === 'optionYes' && ctx.deceasedMaritalStatus === 'optionMarried';
        ctx.inEnglandOrWalesDeceasedNotMarried = ctx.adoptionPlace === 'optionYes' && ctx.deceasedMaritalStatus !== 'optionMarried';

        return {
            options: [
                {key: 'inEnglandOrWalesDeceasedMarried', value: true, choice: 'inEnglandOrWalesDeceasedMarried'},
                {key: 'inEnglandOrWalesDeceasedNotMarried', value: true, choice: 'inEnglandOrWalesDeceasedNotMarried'}
            ]
        };
    }
}

module.exports = AdoptionPlace;
