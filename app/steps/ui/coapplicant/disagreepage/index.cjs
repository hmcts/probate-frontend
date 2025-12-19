'use strict';

const Step = require('app/core/steps/Step.cjs');
const FormatName = require('app/utils/FormatName.cjs');

class CoApplicantDisagreePage extends Step {

    static getUrl () {
        return '/co-applicant-disagree-page';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.leadExecFullName = FormatName.format(formdata.applicant);
        return ctx;
    }

    shouldHaveBackLink() {
        return false;
    }
}

module.exports = CoApplicantDisagreePage;
