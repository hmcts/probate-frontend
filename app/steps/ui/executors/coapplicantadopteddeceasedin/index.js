'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const ExecutorsWrapper = require('../../../../wrappers/Executors');
const pageUrl = '/coapplicant-adopted-deceased-in';

class CoApplicantAdoptedDeceasedIn extends ValidationStep {

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
        if (ctx.list[ctx.index]?.coApplicantAdoptedDeceasedIn) {
            return [true, 'inProgress'];
        }
        return [false, 'inProgress'];
    }

    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            ctx.coApplicantAdoptedDeceasedIn = ctx.list[ctx.index].coApplicantAdoptedDeceasedIn;
        }
        return [ctx];
    }

    nextStepOptions(ctx) {
        const coAppAdoptedDeceasedIn = ctx.coApplicantAdoptedDeceasedIn;
        ctx.coAppAdoptedDeceasedIn = coAppAdoptedDeceasedIn === 'optionYes';
        return {
            options: [
                {key: 'coAppAdoptedDeceasedIn', value: true, choice: 'coAppAdoptedDeceasedIn'},
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
        if (formdata.executors && formdata.executors.list && ctx.coApplicantAdoptedDeceasedIn !== formdata.executors.list[ctx.index]?.coApplicantAdoptedDeceasedIn) {
            delete ctx.list[ctx.index].coApplicantAdoptedDeceasedInEnglandOrWales;
            delete ctx.list[ctx.index].coApplicantAdoptedDeceasedOut;
        }
        ctx.list[ctx.index].coApplicantAdoptedDeceasedIn = ctx.coApplicantAdoptedDeceasedIn;
        return [ctx, errors];
    }
}

module.exports = CoApplicantAdoptedDeceasedIn;
