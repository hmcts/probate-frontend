'use strict';

const Step = require('app/core/steps/Step');
const FormatName = require('app/utils/FormatName');

class CoApplicantAgreePage extends Step {

    static getUrl () {
        return '/co-applicant-agree-page*';
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
}

module.exports = CoApplicantAgreePage;
