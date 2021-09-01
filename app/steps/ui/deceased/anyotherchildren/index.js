'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');

class AnyOtherChildren extends ValidationStep {

    static getUrl() {
        return '/any-other-children*';
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
                {key: 'anyOtherChildren', value: 'optionYes', choice: 'hadOtherChildren'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);

        if (formdata.deceased && formdata.deceased.anyOtherChildren && ctx.anyOtherChildren !== formdata.deceased.anyOtherChildren) {
            delete ctx.allChildrenOver18;
            delete ctx.anyDeceasedChildren;
            delete ctx.anyGrandchildrenUnder18;
        }

        return [ctx, formdata];
    }
}

module.exports = AnyOtherChildren;
