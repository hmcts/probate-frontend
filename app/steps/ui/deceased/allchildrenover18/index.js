'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');

class AllChildrenOver18 extends ValidationStep {

    static getUrl() {
        return '/all-children-over-18*';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('childrenUnder18');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'allChildrenOver18', value: 'optionYes', choice: 'allChildrenOver18'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.deceasedName;
        return [ctx, formdata];
    }
}

module.exports = AllChildrenOver18;
