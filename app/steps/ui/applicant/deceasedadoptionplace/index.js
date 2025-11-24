'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class DeceasedAdoptionPlace extends ValidationStep {

    static getUrl() {
        return '/deceased-adoption-place';
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('adoptionNotEnglandOrWales');
    }

    nextStepOptions(ctx) {
        ctx.parentApplyingAndDeceasedAdoptedInEnglandOrWales = ctx.relationshipToDeceased === 'optionParent' && ctx.deceasedAdoptionPlace === 'optionYes';
        ctx.siblingApplyingAndDeceasedAdoptedInEnglandOrWales = ctx.relationshipToDeceased === 'optionSibling' && ctx.deceasedAdoptionPlace === 'optionYes';
        return {
            options: [
                {key: 'parentApplyingAndDeceasedAdoptedInEnglandOrWales', value: true, choice: 'parentApplyingAndDeceasedAdoptedInEnglandOrWales'},
                {key: 'siblingApplyingAndDeceasedAdoptedInEnglandOrWales', value: true, choice: 'siblingApplyingAndDeceasedAdoptedInEnglandOrWales'}
            ]
        };
    }
}

module.exports = DeceasedAdoptionPlace;
