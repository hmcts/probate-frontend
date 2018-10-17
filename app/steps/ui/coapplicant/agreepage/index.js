'use strict';

const Step = require('app/core/steps/Step');
const WillWrapper = require('app/wrappers/Will');
const FormatName = require('app/utils/FormatName');

class CoApplicantAgreePage extends Step {

    static getUrl () {
        return '/co-applicant-agree-page';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.leadExecFullName = FormatName.format(formdata.applicant);
        ctx.codicilsSuffix = (new WillWrapper(formdata.will)).hasCodicils() ? '-codicils' : '';
        return ctx;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.leadExecFullName;
        delete ctx.codicilsSuffix;
        return [ctx, formdata];
    }
}

module.exports = CoApplicantAgreePage;
