'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');

class DeceasedMaritalStatus extends ValidationStep {

    static getUrl() {
        return '/deceased-marital-status*';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    nextStepOptions(ctx) {
        ctx.divorcedOrSeparated = (ctx.maritalStatus === 'optionDivorced' || ctx.maritalStatus === 'optionSeparated');
        return {
            options: [
                {key: 'divorcedOrSeparated', value: true, choice: 'divorcedOrSeparated'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.deceasedName;
        delete ctx.divorcedOrSeparated;

        if (formdata.deceased && formdata.deceased.maritalStatus && ctx.maritalStatus !== formdata.deceased.maritalStatus) {
            delete ctx.divorcePlace;
            delete ctx.anyChildren;
            delete ctx.anyOtherChildren;
            delete ctx.allChildrenOver18;
            delete ctx.anyDeceasedChildren;
            delete ctx.anyGrandchildrenUnder18;

            if (formdata.applicant) {
                delete formdata.applicant.relationshipToDeceased;
                delete formdata.applicant.spouseNotApplyingReason;
                delete formdata.applicant.adoptionPlace;
            }
        }
        return [ctx, formdata];
    }
}

module.exports = DeceasedMaritalStatus;
