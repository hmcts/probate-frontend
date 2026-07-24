'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const ExecutorsWrapper = require('../../../../wrappers/Executors');
const pageUrl = '/parent-adoption-place';
const PARENT_ADOPTION_PLACE_FIELDS = {
    optionGrandchild: 'grandchildParentAdoptionInEnglandOrWales',
    optionWholeBloodNieceOrNephew: 'wholeBloodNieceOrNephewAdoptionInEnglandOrWales'
};

class CoApplicantParentAdoptionPlace extends ValidationStep {

    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
    }

    getContextData(req) {
        const formdata = req.session.form;
        const ctx = super.getContextData(req);
        if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
        } else {
            const executorsWrapper = new ExecutorsWrapper(formdata.executors);
            ctx.index = executorsWrapper.getNextIndex();
            ctx.redirect = `${pageUrl}/${ctx.index}`;
        }
        ctx.deceasedName = FormatName.format(formdata.deceased);
        ctx.applicantName = ctx.list?.[ctx.index]?.fullName;
        ctx.relationshipToDeceased = ctx.list?.[ctx.index]?.coApplicantRelationshipToDeceased;
        return ctx;
    }

    isComplete(ctx) {
        const adoptionPlaceField = this.parentAdoptionPlaceField(ctx);
        const isParentAdoptionInEnglandOrWales = adoptionPlaceField && ctx.list[ctx.index]?.[adoptionPlaceField] === 'optionYes';
        return [isParentAdoptionInEnglandOrWales, 'inProgress'];
    }
    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            const adoptionPlaceField = this.parentAdoptionPlaceField(ctx);
            ctx.applicantParentAdoptionPlace = ctx.list[ctx.index][adoptionPlaceField];
        }
        return [ctx];
    }

    nextStepUrl(req, ctx) {
        const relationship = ctx.list?.[ctx.index]?.coApplicantRelationshipToDeceased;
        if (relationship === 'optionWholeBloodNieceOrNephew') {
            return this.next(req, ctx).getUrlWithContext(ctx, 'coApplicantParentAdoptionPlaceNoNameStop');
        }
        return this.next(req, ctx).getUrlWithContext(ctx, 'coApplicantAdoptionPlaceStop');
    }

    nextStepOptions(ctx) {
        const relationship = ctx.list?.at(ctx.index)?.coApplicantRelationshipToDeceased;
        const parentAdoptedEngWales = ctx.applicantParentAdoptionPlace;
        ctx.wholeBloodNieceOrNephewParentAdoptedInEnglandOrWales = relationship === 'optionWholeBloodNieceOrNephew' && parentAdoptedEngWales === 'optionYes';
        ctx.parentAdoptedInEnglandOrWales = relationship !== 'optionWholeBloodNieceOrNephew' && parentAdoptedEngWales === 'optionYes';
        return {
            options: [
                {key: 'wholeBloodNieceOrNephewParentAdoptedInEnglandOrWales', value: true, choice: 'wholeBloodNieceOrNephewParentAdoptedInEnglandOrWales'},
                {key: 'parentAdoptedInEnglandOrWales', value: true, choice: 'parentAdoptedOutEnglandOrWales'},
            ]
        };
    }

    handlePost(ctx, errors, formdata) {
        const adoptionPlaceField = this.parentAdoptionPlaceField(ctx);
        if (adoptionPlaceField) {
            ctx.list[ctx.index][adoptionPlaceField] = ctx.applicantParentAdoptionPlace;
            if (formdata.executors?.list?.[ctx.index]) {
                formdata.executors.list[ctx.index][adoptionPlaceField] = ctx.applicantParentAdoptionPlace;
            }
        }
        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        // Keep route-only flags out of persisted executor payload.
        delete ctx.wholeBloodNieceOrNephewParentAdoptedInEnglandOrWales;
        delete ctx.parentAdoptedInEnglandOrWales;
        delete ctx.deceasedName;
        delete ctx.applicantName;
        return [ctx, formdata];
    }

    parentAdoptionPlaceField(ctx) {
        return PARENT_ADOPTION_PLACE_FIELDS[ctx.list?.[ctx.index]?.coApplicantRelationshipToDeceased] || null;
    }
}

module.exports = CoApplicantParentAdoptionPlace;
