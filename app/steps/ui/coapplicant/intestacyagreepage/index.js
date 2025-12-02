'use strict';

const Step = require('app/core/steps/Step');
const FormatName = require('app/utils/FormatName');
const config = require('config');

class IntestacyCoApplicantAgreePage extends Step {

    static getUrl () {
        return '/intestacy-co-applicant-agree-page';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.leadExecFullName = FormatName.format(formdata.applicant);
        ctx.probateEstate =config.links.probateEstate;
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

module.exports = IntestacyCoApplicantAgreePage;
