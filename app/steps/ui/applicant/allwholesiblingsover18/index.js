'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');

class AllWholeSiblingsOver18 extends ValidationStep {

    static getUrl() {
        return '/whole-siblings-age';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).getUrlWithContext(ctx, 'anyoneUnder18');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'allWholeSiblingsOver18', value: 'optionYes', choice: 'allWholeSiblingsOver18'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.deceasedName;
        return [ctx, formdata];
    }
}

module.exports = AllWholeSiblingsOver18;
