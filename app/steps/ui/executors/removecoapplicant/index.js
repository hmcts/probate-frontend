'use strict';

const {set} = require('lodash');
const ValidationStep = require('../../../../core/steps/ValidationStep');

class RemoveCoApplicant extends ValidationStep {

    static getUrl(index = '*') {
        return `/remove-coApplicant/${index}`;
    }
    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.index = req.params[0];
        ctx.list = req.session.form.coApplicants?.list || [];
        ctx.executorFullName = ctx.list?.[ctx.index] ? ctx.list[ctx.index].fullName : '';
        return ctx;
    }

    handlePost(ctx, errors, formdata) {
        if (ctx.removeCoApplicant === 'optionYes') {
            ctx.list.splice(ctx.index, 1);
            set(formdata, 'executors.list', ctx.list);
            set(formdata, 'coApplicants.list', ctx.list);
        }
        return [ctx, errors];
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.executorFullName && errors) {
            errors[0].msg = errors[0].msg.replace('{executorFullName}', fields.executorFullName.value);
        }
        return fields;
    }
}

module.exports = RemoveCoApplicant;
