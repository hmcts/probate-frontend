const Step = require('app/core/steps/Step');

module.exports = class CoApplicantStartPage extends Step {

    static getUrl () {
        return '/co-applicant-start-page';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        const applicant = formdata.applicant || {};
        const deceased = formdata.deceased || {};

        const leadExecFirstName = applicant.firstName;
        const leadExecLastName = applicant.lastName;

        const deceasedFirstName = deceased.firstName;
        const deceasedLastName = deceased.lastName;

        ctx.leadExecFullName = leadExecFirstName +' '+ leadExecLastName;
        ctx.deceasedFullName = deceasedFirstName +' '+ deceasedLastName;
        delete req.session.pin;

        return ctx;
    }
};
