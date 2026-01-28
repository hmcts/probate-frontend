'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const ExecutorsWrapper = require('app/wrappers/Executors');
const pageUrl = '/parent-adopted-in';

class CoApplicantParentAdoptedIn extends ValidationStep {
    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
    }

    getUrlWithContext(ctx) {
        const noCtxUrl = this.constructor.getUrl(ctx?.index);
        if (ctx?.caseType === 'intestacy') {
            return `/intestacy${noCtxUrl}`;
        }
        return noCtxUrl;
    }

    getContextData(req) {
        const formData = req.session.form;
        const ctx = super.getContextData(req);
        if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
        } else {
            const executorsWrapper = new ExecutorsWrapper(formData.executors);
            ctx.index = executorsWrapper.getNextIndex();
            ctx.redirect = `${pageUrl}/${ctx.index}`;
        }
        ctx.deceasedName = FormatName.format(formData.deceased);
        ctx.applicantName = ctx.list?.[ctx.index]?.fullName;
        return ctx;
    }
    isComplete(ctx) {
        if (ctx.list[ctx.index]?.grandchildParentAdoptedIn) {
            return [true, 'inProgress'];
        }
        return [false, 'inProgress'];
    }

    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            ctx.applicantParentAdoptedIn = ctx.list[ctx.index].grandchildParentAdoptedIn;
        }
        return [ctx];
    }

    nextStepOptions(ctx) {
        ctx.parentAdopted = ctx.list[ctx.index]?.grandchildParentAdoptedIn === 'optionYes';
        return {
            options: [
                {key: 'parentAdopted', value: true, choice: 'parentAdoptedIn'},
                {key: 'parentAdopted', value: false, choice: 'notParentAdoptedIn'},
            ]
        };
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.deceasedName && errors) {
            errors[0].msg = errors[0].msg.replace('{deceasedName}', fields.deceasedName.value).replace('{applicantName}', fields.applicantName.value);
        }
        return fields;
    }

    nextStepUrl(req, ctx) {
        if (ctx.applicantParentAdoptedIn === 'optionYes') {
            return `/parent-adoption-place/${ctx.index}`;
        }
        return `/parent-adopted-out/${ctx.index}`;
    }

    handlePost(ctx, errors) {
        ctx.list[ctx.index].grandchildParentAdoptedIn = ctx.applicantParentAdoptedIn;
        return [ctx, errors];
    }
}

module.exports = CoApplicantParentAdoptedIn;
