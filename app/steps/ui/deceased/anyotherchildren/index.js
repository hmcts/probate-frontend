'use strict';
const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');
const content = require('app/resources/en/translation/deceased/anychildren');

class AnyOtherChildren extends ValidationStep {

    static getUrl() {
        return '/any-other-children';
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
                {key: 'anyOtherChildren', value: content.optionYes, choice: 'hadOtherChildren'}
            ]
        };
    }
}

module.exports = AnyOtherChildren;
