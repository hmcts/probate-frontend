'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');
const content = require('app/resources/en/translation/deceased/anydeceasedchildren');
const {get} = require('lodash');

class AnyDeceasedChildren extends ValidationStep {

    static getUrl() {
        return '/any-deceased-children';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        ctx.deceasedDoD = get(formdata, 'deceased.dod_formattedDate');
        return ctx;
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'anyDeceasedChildren', value: content.optionYes, choice: 'hadDeceasedChildren'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.deceasedName;
        delete ctx.deceasedDoD;
        return [ctx, formdata];
    }
}

module.exports = AnyDeceasedChildren;
