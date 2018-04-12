const Step = require('app/core/steps/Step');
const WillWrapper = require('app/wrappers/Will');

module.exports = class CoApplicantAgreePage extends Step {

    static getUrl () {
        return '/co-applicant-agree-page';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        const applicant = formdata.applicant || {};
        const will = formdata.will || {};

        ctx.leadExecFullName = `${applicant.firstName} ${applicant.lastName}`;
        ctx.codicilsSuffix = (new WillWrapper(will)).hasCodicils() ? '-codicils' : '';

        return ctx;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.leadExecFullName;
        delete ctx.codicilsSuffix;
        return [ctx, formdata];
    }
};