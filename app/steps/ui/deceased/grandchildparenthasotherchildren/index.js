'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');

class GrandchildParentHasOtherChildren extends ValidationStep {

    static getUrl() {
        return '/mainapplicantsparent-any-other-children';
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
                {key: 'grandchildParentHasOtherChildren', value: 'optionYes', choice: 'grandchildParentHasOtherChildren'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);

        if (formdata.deceased && formdata.deceased.grandchildParentHasOtherChildren && ctx.grandchildParentHasOtherChildren !== formdata.deceased.grandchildParentHasOtherChildren) {
            delete ctx.grandchildParentHasAllChildrenOver18;
        }

        return [ctx, formdata];
    }
}

module.exports = GrandchildParentHasOtherChildren;
