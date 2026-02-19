'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');
const {set} = require('lodash');

class GrandchildParentHasOtherChildren extends ValidationStep {

    static getUrl() {
        return '/mainapplicantsparent-any-other-children';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        ctx.list = formdata.executors?.list;
        return ctx;
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'grandchildParentHasOtherChildren', value: 'optionYes', choice: 'grandchildParentHasOtherChildren'}
            ]
        };
    }

    handlePost(ctx, errors, formdata) {
        if (ctx.list?.length > 1 && formdata.deceased?.grandchildParentHasOtherChildren && ctx.grandchildParentHasOtherChildren !== formdata.deceased.grandchildParentHasOtherChildren) {
            if (ctx.grandchildParentHasOtherChildren === 'optionNo') {
                ctx.list.splice(1);
                set(formdata, 'executors.list', ctx.list);
            }
        }
        return super.handlePost(ctx, errors);
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);

        if (formdata.deceased?.grandchildParentHasOtherChildren && ctx.grandchildParentHasOtherChildren !== formdata.deceased.grandchildParentHasOtherChildren) {
            delete ctx.grandchildParentHasAllChildrenOver18;
        }

        return [ctx, formdata];
    }
}

module.exports = GrandchildParentHasOtherChildren;
