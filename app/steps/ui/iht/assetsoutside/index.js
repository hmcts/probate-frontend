'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');

class AssetsOutside extends ValidationStep {

    static getUrl() {
        return '/assets-outside-england-wales*';
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
                {key: 'assetsOutside', value: 'optionYes', choice: 'hasAssetsOutside'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.deceasedName;

        if (ctx.assetsOutside === 'optionNo') {
            delete ctx.netValueAssetsOutsideField;
            delete ctx.netValueAssetsOutside;
        }

        return [ctx, formdata];
    }
}

module.exports = AssetsOutside;
