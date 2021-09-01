'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');

class AnyDeceasedChildren extends ValidationStep {

    static getUrl() {
        return '/any-deceased-children*';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'anyDeceasedChildren', value: 'optionYes', choice: 'hadDeceasedChildren'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.deceasedName;

        if (formdata.deceased && formdata.deceased.anyDeceasedChildren && ctx.anyDeceasedChildren !== formdata.deceased.anyDeceasedChildren) {
            delete ctx.anyGrandchildrenUnder18;
        }

        return [ctx, formdata];
    }
}

module.exports = AnyDeceasedChildren;
