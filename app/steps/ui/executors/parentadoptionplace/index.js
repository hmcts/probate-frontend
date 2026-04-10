'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const ExecutorsWrapper = require('../../../../wrappers/Executors');
const pageUrl = '/parent-adoption-place';

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
        return ctx;
    }

    isComplete(ctx) {
        const isGrandchildParentAdoptionInEnglandOrWales = ctx.list[ctx.index]?.grandchildParentAdoptionInEnglandOrWales === 'optionYes';
        return [isGrandchildParentAdoptionInEnglandOrWales, 'inProgress'];
    }
    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            ctx.applicantParentAdoptionPlace = ctx.list[ctx.index].grandchildParentAdoptionInEnglandOrWales;
        }
        return [ctx];
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).getUrlWithContext(ctx, 'coApplicantAdoptionPlaceStop');
    }

    nextStepOptions(ctx) {
        const parentAdoptedEngWales = ctx.list?.at(ctx.index)?.grandchildParentAdoptionInEnglandOrWales;
        ctx.parentAdoptedInEnglandOrWales = parentAdoptedEngWales === 'optionYes';
        return {
            options: [
                {key: 'parentAdoptedInEnglandOrWales', value: true, choice: 'parentAdoptedOutEnglandOrWales'},
            ]
        };
    }

    handlePost(ctx, errors, formdata) {
        const executorsWrapper = new ExecutorsWrapper(formdata.executors);
        const checkAllExecutorsHaveValidDetails = executorsWrapper.checkAllExecutorsHaveValidDetails();
        formdata.executors.list[ctx.index].grandchildParentAdoptionInEnglandOrWales = ctx.applicantParentAdoptionPlace;
        if (ctx.applicantParentAdoptionPlace === 'optionNo') {
            ctx.hasCoApplicant = 'optionYes';
        } else if (ctx.applicantParentAdoptionPlace === 'optionYes' && checkAllExecutorsHaveValidDetails) {
            ctx.hasCoApplicant = 'optionNo';
        }
        return [ctx, errors];
    }
}

module.exports = CoApplicantParentAdoptionPlace;
