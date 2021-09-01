'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');

class SpouseNotApplyingReason extends ValidationStep {

    static getUrl() {
        return '/spouse-not-applying-reason*';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('spouseNotApplying');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'spouseNotApplyingReason', value: 'optionRenouncing', choice: 'renouncing'},
            ]
        };
    }
}

module.exports = SpouseNotApplyingReason;
