'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');

class AnyGrandchildrenUnder18 extends ValidationStep {

    static getUrl() {
        return '/any-grandchildren-under-18*';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('grandchildrenUnder18');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'anyGrandchildrenUnder18', value: 'optionNo', choice: 'allGrandchildrenOver18'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.deceasedName;
        return [ctx, formdata];
    }
}

module.exports = AnyGrandchildrenUnder18;
