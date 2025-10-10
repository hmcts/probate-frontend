'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const {findIndex} = require('lodash');
const FormatName = require('../../../../utils/FormatName');
const pageUrl = '/coapplicant-name';

class CoApplicantName extends ValidationStep {

    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.list = formdata.coApplicants.list;
        if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
        } else {
            ctx.index = this.recalcIndex(ctx, 0);
            ctx.redirect = `${pageUrl}/${ctx.index}`;
        }
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    recalcIndex(ctx, index) {
        return findIndex(ctx.list, o => o.isApplying === true, index + 1);
    }

    nextStepUrl(req, ctx) {
        if (ctx.index === -1) {
            return this.next(req, ctx).constructor.getUrl();
        }
        return this.next(req, ctx).constructor.getUrl(ctx.index);
    }

    handleGet(ctx, formdata) {
        const coApplicants = formdata.coApplicants.list[ctx.index];
        ctx.coApplicantName = coApplicants.coApplicantName;
        return [ctx];
    }

    handlePost(ctx, errors, formdata) {
        formdata.coApplicants.list[ctx.index].fullName = ctx.coApplicantName;
        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        return [ctx, formdata];
    }
}

module.exports = CoApplicantName;
