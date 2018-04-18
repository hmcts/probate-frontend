const Step = require('app/core/steps/Step');

module.exports = class CoApplicantDisagreePage extends Step {

    static getUrl () {
        return '/co-applicant-disagree-page';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        const applicant = formdata.applicant || {};

        const leadExecFirstName = applicant.firstName;
        const leadExecLastName = applicant.lastName;

        ctx.leadExecFullName = leadExecFirstName +' '+ leadExecLastName;
        return ctx;
    }
};
