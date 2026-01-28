'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const ExecutorsWrapper = require('../../../../wrappers/Executors');
const pageUrl = '/parent-adopted-out';

class CoApplicantParentAdoptedOut extends ValidationStep {

    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
    }

    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            ctx.applicantParentAdoptedOut = ctx.list[ctx.index].grandchildParentAdoptedOut;
        }
        return [ctx];
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
        ctx.applicantName = ctx.list?.[ctx.index]?.fullName;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }
    isComplete(ctx) {
        if (ctx.list[ctx.index]?.grandchildParentAdoptedOut) {
            return [true, 'inProgress'];
        }
        return [false, 'inProgress'];
    }

    nextStepUrl(req, ctx) {
        if (ctx.applicantParentAdoptedOut === 'optionNo') {
            return `/coapplicant-email/${ctx.index}`;
        }
        return this.next(req, ctx).getUrlWithContext(ctx, 'coApplicantParentAdoptedOutStop');
    }
    nextStepOptions(ctx) {
        ctx.parentNotAdoptedOut = ctx.list[ctx.index]?.grandchildParentAdoptedOut === 'optionNo';
        return {
            options: [
                {key: 'parentNotAdoptedOut', value: true, choice: 'parentNotAdoptedOut'},
            ]
        };
    }
    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.deceasedName && fields.applicantName && errors) {
            errors[0].msg = errors[0].msg.replace('{deceasedName}', fields.deceasedName.value).replace('{applicantName}', fields.applicantName.value);
        }
        return fields;
    }
    handlePost(ctx, errors, formdata) {
        formdata.executors.list[ctx.index].grandchildParentAdoptedOut = ctx.applicantParentAdoptedOut;
        return [ctx, errors];
    }
}

module.exports = CoApplicantParentAdoptedOut;
