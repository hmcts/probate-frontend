'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');

class AnyChildren extends ValidationStep {

    static getUrl() {
        return '/any-children*';
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
                {key: 'anyChildren', value: 'optionYes', choice: 'hadChildren'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.deceasedName;

        if (formdata.deceased && formdata.deceased.anyChildren && ctx.anyChildren !== formdata.deceased.anyChildren) {
            delete ctx.allChildrenOver18;
            delete ctx.anyDeceasedChildren;
            delete ctx.anyGrandchildrenUnder18;
        }

        return [ctx, formdata];
    }
}

module.exports = AnyChildren;
