'use strict';

const Step = require('app/core/steps/Step');
const FormatName = require('app/utils/FormatName');

class CoApplicantStartPage extends Step {

    static getUrl () {
        return '/co-applicant-start-page*';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.leadExecFullName = FormatName.format(formdata.applicant);
        ctx.deceasedFullName = FormatName.format(formdata.deceased);
        delete req.session.pin;
        return ctx;
    }
}

module.exports = CoApplicantStartPage;
