'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const {findIndex} = require('lodash');
const pageUrl = '/parent-adopted-out';

class ParentAdoptedOut extends ValidationStep {

    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
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
        ctx.applicantName = ctx.list?.[ctx.index]?.fullName;
        return ctx;
    }
    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            ctx.applicantParentAdoptedOut = ctx.list[ctx.index].grandchildParentAdoptedOut;
        }
        return [ctx];
    }
    recalcIndex(ctx, index) {
        return findIndex(ctx.list, o => o.isApplying === true, index + 1);
    }

    nextStepUrl(req, ctx) {
        if (ctx.applicantParentAdoptedOut === 'optionNo') {
            return `/coapplicant-email/${ctx.index}`;
        }
        return this.next(req, ctx).constructor.getUrl('coApplicantParentAdoptedOutStop');
    }
    nextStepOptions() {
        return {
            options: [
                {key: 'applicantParentAdoptedOut', value: 'optionNo', choice: 'parentNotAdoptedOut'},
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

module.exports = ParentAdoptedOut;
