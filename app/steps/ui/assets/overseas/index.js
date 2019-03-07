'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');
const json = require('app/resources/en/translation/assets/overseas');

class AssetsOverseas extends ValidationStep {

    static getUrl() {
        return '/assets-overseas';
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
                {key: 'assetsoverseas', value: json.optionYes, choice: 'assetsoverseas'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.deceasedName;
        return [ctx, formdata];
    }
}

module.exports = AssetsOverseas;
