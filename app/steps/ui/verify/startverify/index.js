'use strict';

const Step = require('app/core/steps/Step');
const config = require('config');
const FormatName = require('../../../../utils/FormatName');

class StartVerify extends Step {

    static getUrl() {
        return '/start-verify';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        const formdataApplicant = formdata.applicant || {};
        ctx.applicantName = FormatName.format(formdataApplicant);
        ctx.applicationFormPA12 =config.links.applicationFormPA12;
        return ctx;
    }
    shouldHaveBackLink() {
        return false;
    }
}

module.exports = StartVerify;
