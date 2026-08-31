'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const ExecutorsWrapper = require('../../../../wrappers/Executors');
const pageUrl = '/coapplicant-adoption-place';

class CoApplicantAdoptionDeceasedPlace extends ValidationStep {

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
        if (ctx.list[ctx.index]?.coApplicantAdoptionDeceasedInEnglandOrWales) {
            return [true, 'inProgress'];
        }
        return [false, 'inProgress'];
    }

    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            ctx.coApplicantAdoptionDeceasedInEnglandOrWales = ctx.list[ctx.index].coApplicantAdoptionDeceasedInEnglandOrWales;
        }
        return [ctx];
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).getUrlWithContext(ctx, 'coApplicantAdoptionDeceasedPlaceStop');
    }

    nextStepOptions(ctx) {
        const coAppDeceasedAdoptionInEnglandOrWales = ctx.coApplicantAdoptionDeceasedPlace;
        ctx.coAppAdoptionDeceasedPlace = coAppDeceasedAdoptionInEnglandOrWales === 'optionYes';
        return {
            options: [
                {key: 'coAppAdoptionDeceasedPlace', value: true, choice: 'coAppAdoptionDeceasedPlace'},
            ]
        };
    }

    handlePost(ctx, errors, formdata) {
        formdata.executors.list[ctx.index].coApplicantAdoptionDeceasedInEnglandOrWales = ctx.coAppAdoptionDeceasedPlace;
        if (ctx.coAppAdoptionDeceasedPlace === 'optionNo') {
            ctx.hasCoApplicant = 'optionYes';
        }
        return [ctx, errors];
    }
}

module.exports = CoApplicantAdoptionDeceasedPlace;
