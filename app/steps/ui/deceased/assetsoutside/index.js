'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');
const content = require('app/resources/en/translation/deceased/assetsoutside');

class AssetsOutside extends ValidationStep {

    static getUrl() {
        return '/assets-outside-england-wales';
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
                {key: 'assetsOutside', value: content.optionYes, choice: 'hasAssetsOutside'}
            ]
        };
    }
}

module.exports = AssetsOutside;
