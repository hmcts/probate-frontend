'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');
const pageUrl = '/domicile-eng-or-wales';

class DomicileEnglandOrWales extends ValidationStep {

    static getUrl() {
        return pageUrl;
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
                {key: 'deceasedDomicile', value: 'optionYes', choice: 'isDomicile'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.deceasedName;

        return [ctx, formdata];
    }
}

module.exports = DomicileEnglandOrWales;
