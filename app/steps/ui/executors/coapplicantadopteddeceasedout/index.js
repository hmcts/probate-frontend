'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const ExecutorsWrapper = require('../../../../wrappers/Executors');
const pageUrl = '/coapplicant-adopted-deceased-out';

class coApplicantAdoptedDeceasedOut extends ValidationStep {

    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
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
        if (ctx.coApplicantAdoptedDeceasedOut) {
            return [true, 'inProgress'];
        }
        return [false, 'inProgress'];
    }

    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            ctx.coAppAdoptedDeceasedOut = ctx.list[ctx.index].coAppAdoptedDeceasedOut;
        }
        return [ctx];
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).getUrlWithContext(ctx, 'coApplicantAdoptedDeceasedOutStop');
    }

    nextStepOptions(ctx) {
        const coAppAdoptedDeceasedOut = ctx.coApplicantAdoptedDeceasedOut;
        ctx.coAppAdoptedDeceasedOut = coAppAdoptedDeceasedOut === 'optionYes';
        return {
            options: [
                {key: 'coAppAdoptedDeceasedOut', value: true, choice: 'coAppAdoptedDeceasedOut'},
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

    handlePost(ctx, errors, formdata) {
        formdata.executors.list[ctx.index].coApplicantAdoptedDeceasedOut = ctx.coApplicantAdoptedDeceasedOut;
        if (ctx.coApplicantAdoptedDeceasedOut === 'optionYes') {
            ctx.hasCoApplicant = 'optionYes';
        }
        return [ctx, errors];
    }
}

module.exports = coApplicantAdoptedDeceasedOut;
