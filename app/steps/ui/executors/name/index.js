'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const {set} = require('lodash');

class CoApplicantName extends ValidationStep {

    static getUrl() {
        return '/coapplicant-name';
    }

    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            ctx.currentName = ctx.list[ctx.index].currentName;
        }
        return [ctx];
    }

    handlePost(ctx, errors, formdata) {
        ctx.list[0].fullName = 'full Name Hello';
        set(formdata, 'coApplicants.list', ctx.list);
        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        return [ctx, formdata];
    }
}

module.exports = CoApplicantName;
