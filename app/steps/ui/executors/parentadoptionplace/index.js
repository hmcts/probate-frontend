'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const {findIndex} = require('lodash');
const pageUrl = '/parent-adoption-place';

class ParentAdoptionPlace extends ValidationStep {

    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
    }

    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            ctx.applicantParentAdoptionPlace = ctx.list[ctx.index].childAdoptionInEnglandOrWales;
        }
        return [ctx];
    }

    getContextData(req) {
        const formdata = req.session.form;
        const ctx = super.getContextData(req);
        if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
        } else {
            ctx.index = this.recalcIndex(ctx, 0);
            ctx.redirect = `${pageUrl}/${ctx.index}`;
        }
        ctx.deceasedName = FormatName.format(formdata.deceased);
        const applicant = formdata.applicant;
        ctx.applicantName= applicant?.alias ?? FormatName.format(applicant);
        return ctx;
    }

    recalcIndex(ctx, index) {
        return findIndex(ctx.list, o => o.isApplying === true, index + 1);
    }

    nextStepUrl(req, ctx) {
        if (ctx.applicantParentAdoptionPlace === 'optionYes') {
            return `/coapplicant-email/${ctx.index}`;
        }
        return this.next(req, ctx).constructor.getUrl('coApplicantAdoptionPlaceStop');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'applicantParentAdoptionPlace', value: 'optionYes', choice: 'parentAdoptedOutEnglandOrWales'},
            ]
        };
    }

    handlePost(ctx, errors, formdata) {
        formdata.executors.list[ctx.index].childAdoptionInEnglandOrWales=ctx.applicantParentAdoptionPlace;
        return [ctx, errors];
    }
}

module.exports = ParentAdoptionPlace;
