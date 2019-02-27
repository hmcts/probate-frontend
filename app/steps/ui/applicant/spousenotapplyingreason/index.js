'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');
const content = require('app/resources/en/translation/applicant/spousenotapplyingreason');

class SpouseNotApplyingReason extends ValidationStep {

    static getUrl() {
        return '/spouse-not-applying-reason';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    nextStepUrl(ctx) {
        return this.next(ctx).constructor.getUrl('spouseNotApplying');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'spouseNotApplyingReason', value: content.optionRenouncing, choice: 'renouncing'},
            ]
        };
    }
}

module.exports = SpouseNotApplyingReason;
