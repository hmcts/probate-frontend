'use strict';

const Step = require('app/core/steps/Step');
const FormatName = require('app/utils/FormatName');
const config = require('config');

class IntestacyCoApplicantDisagreePage extends Step {

    static getUrl () {
        return '/intestacy-co-applicant-disagree-page';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.leadExecFullName = FormatName.format(formdata.applicant);
        ctx.findLegalAdvice =config.links.findLegalAdvice;
        return ctx;
    }

    shouldHaveBackLink() {
        return false;
    }
}

module.exports = IntestacyCoApplicantDisagreePage;
