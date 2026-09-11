'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const ExecutorsWrapper = require('../../../../wrappers/Executors');
const pageUrl = '/coapplicant-adoption-deceased-place';

class CoApplicantAdoptionDeceasedPlace extends ValidationStep {

    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
    }

    getContextData(req) {
        const formData = req.session.form;
        const ctx = super.getContextData(req);
        if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
        } else {
            // the only context in which we can be on this page is:
            //  - the applicant is the parent
            //  - the only valid coapplicant is the other parent
            // therefore the index should always be one here
            ctx.index = 1;
            ctx.redirect = `${pageUrl}/${ctx.index}`;
        }
        ctx.deceasedName = FormatName.format(formData.deceased);
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
            ctx.coApplicantAdoptionDeceasedPlace = ctx.list[ctx.index].coApplicantAdoptionDeceasedInEnglandOrWales;
        }
        return [ctx];
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).getUrlWithContext(ctx, 'coApplicantAdoptionDeceasedPlaceStop');
    }

    nextStepOptions(ctx) {
        const coAppDeceasedAdoptionInEnglandOrWales = ctx.list?.[ctx.index].coApplicantAdoptionDeceasedInEnglandOrWales;
        ctx.thisCoApplicantAdoptedDeceasedInEnglandOrWales = coAppDeceasedAdoptionInEnglandOrWales === 'optionYes';
        return {
            options: [
                {key: 'thisCoApplicantAdoptedDeceasedInEnglandOrWales', value: true, choice: 'coAppDeceasedInEnglandOrWales'},
            ]
        };
    }

    handlePost(ctx, errors, formdata) {
        formdata.executors.list[ctx.index].coApplicantAdoptionDeceasedInEnglandOrWales = ctx.coApplicantAdoptionDeceasedPlace;

        return [ctx, errors];
    }

    action(ctx, formdata) {
        delete ctx.coAppAdoptionDeceasedPlace;
        delete ctx.thisCoApplicantAdoptedDeceasedInEnglandOrWales;
        return super.action(ctx, formdata);
    }
}

module.exports = CoApplicantAdoptionDeceasedPlace;
