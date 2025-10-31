'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const {findIndex} = require('lodash');
const FormatName = require('../../../../utils/FormatName');
const FieldError = require('../../../../components/error');
const pageUrl = '/coapplicant-name';

class CoApplicantName extends ValidationStep {

    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
    }

    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            ctx.fullName = ctx.list[ctx.index].fullName;
        }
        return [ctx];
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
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

    action(ctx, formdata) {
        super.action(ctx, formdata);
        return [ctx, formdata];
    }

    handlePost(ctx, errors, formdata, session) {
        if (ctx.fullName && ctx.fullName.length < 2) {
            errors.push(FieldError('fullName', 'minLength', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        } else if (ctx.fullName && ctx.fullName.length > 100) {
            errors.push(FieldError('fullName', 'maxLength', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }
        ctx.list[ctx.index].fullName = ctx.fullName;
        return [ctx, errors];
    }
}

module.exports = CoApplicantName;
