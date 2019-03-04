'use strict';
const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');
const content = require('app/resources/en/translation/deceased/anychildren');

class AnyChildren extends ValidationStep {

    static getUrl() {
        return '/any-children';
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
                {key: 'anyChildren', value: content.optionYes, choice: 'hadChildren'}
            ]
        };
    }
}

module.exports = AnyChildren;
