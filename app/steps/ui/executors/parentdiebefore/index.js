'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');
const {findIndex} = require('lodash');
const pageUrl = '/parent-die-before';
class ParentDieBefore extends ValidationStep {

    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
    }

    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            ctx.applicantParentDieBeforeDeceased = ctx.list[ctx.index].childDieBeforeDeceased;
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
        return ctx;
    }

    recalcIndex(ctx, index) {
        return findIndex(ctx.list, o => o.isApplying === true, index + 1);
    }

    nextStepUrl(req, ctx) {
        if (ctx.applicantParentDieBeforeDeceased === 'optionYes') {
            return `/coapplicant-name/${ctx.index}`;
        }
        return this.next(req, ctx).constructor.getUrl('otherCoApplicantRelationship');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'applicantParentDieBeforeDeceased', value: 'optionYes', choice: 'parentDieBefore'},
            ]
        };
    }

    handlePost(ctx, errors) {
        ctx.list[ctx.index].childDieBeforeDeceased = ctx.applicantParentDieBeforeDeceased;
        return [ctx, errors];
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.deceasedName && errors) {
            errors[0].msg = errors[0].msg.replace('{deceasedName}', fields.deceasedName.value);
        }
        return fields;
    }
}

module.exports = ParentDieBefore;
