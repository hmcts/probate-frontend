'use strict';

const Step = require('app/core/steps/Step.cjs');
const FormatName = require('app/utils/FormatName.cjs');

class CoApplicantAgreePage extends Step {

    static getUrl () {
        return '/co-applicant-agree-page';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.leadExecFullName = FormatName.format(formdata.applicant);
        return ctx;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.leadExecFullName;
        return [ctx, formdata];
    }

    shouldHaveBackLink() {
        return false;
    }
}

module.exports = CoApplicantAgreePage;
