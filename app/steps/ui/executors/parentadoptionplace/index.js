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
        if (ctx.list[ctx.index]?.grandchildParentAdoptionInEnglandOrWales) {
            return [true, 'inProgress'];
        }
        return [false, 'inProgress'];
    }
    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            ctx.applicantParentAdoptionPlace = ctx.list[ctx.index].grandchildParentAdoptionInEnglandOrWales;
        }
        return [ctx];
    }

    nextStepUrl(req, ctx) {
        if (ctx.applicantParentAdoptionPlace === 'optionYes') {
            return `/coapplicant-email/${ctx.index}`;
        }
        return this.next(req, ctx).constructor.getUrl('coApplicantAdoptionPlaceStop');
    }

    nextStepOptions(ctx) {
        ctx.parentAdoptedInEnglandOrWales = ctx.list[ctx.index]?.grandchildParentAdoptionInEnglandOrWales === 'optionYes';
        return {
            options: [
                {key: 'parentAdoptedInEnglandOrWales', value: true, choice: 'parentAdoptedOutEnglandOrWales'},
            ]
        };
    }

    handlePost(ctx, errors, formdata) {
        formdata.executors.list[ctx.index].grandchildParentAdoptionInEnglandOrWales = ctx.applicantParentAdoptionPlace;
        return [ctx, errors];
    }
}

module.exports = CoApplicantParentAdoptionPlace;
