'use strict';

const {forEach} = require('lodash');
const Step = require('app/core/steps/Step');
const FormatCcdCaseId = require('app/utils/FormatCcdCaseId');
const EligibilityCookie = require('app/utils/EligibilityCookie');
const eligibilityCookie = new EligibilityCookie();

class Dashboard extends Step {

    static getUrl() {
        return '/dashboard*';
    }

    getContextData(req, res) {
        const ctx = super.getContextData(req, res);
        delete ctx.caseType;
        delete ctx.ccdCase;
        ctx.applications = req.session.form.applications;
        forEach(ctx.applications, application => {
            application.ccdCase.idFormatted = FormatCcdCaseId.format(application.ccdCase);
            application.ccdCase.idFormattedAccessible = FormatCcdCaseId.formatAccessible(application.ccdCase);
        });
        eligibilityCookie.clearCookie(req, res);
        return ctx;
    }

    handleGet(ctx) {
        ctx.isDashboard = true;
        return [ctx];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.applications;
        return [ctx, formdata];
    }
}

module.exports = Dashboard;
