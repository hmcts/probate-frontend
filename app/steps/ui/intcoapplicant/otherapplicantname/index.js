'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const pageUrl = '/other-applicant-name';

class OtherApplicantName extends ValidationStep {

    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
    }

    handleGet(ctx) {
        if (ctx.list[ctx.index]) {
            ctx.otherApplicant = ctx.list[ctx.index].otherApplicant;
        }
        return [ctx];
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        //const formdata = req.session.form;
        return ctx;
    }

    shouldPersistFormData() {
        return false;
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('adoptedIn');
    }

    nextStepOptions() {
        //ctx.continue = get(ctx, 'index', -1) !== -1;
    }
}

module.exports = OtherApplicantName;
