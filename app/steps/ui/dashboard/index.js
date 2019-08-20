'use strict';

const Step = require('app/core/steps/Step');

class Dashboard extends Step {

    static getUrl() {
        return '/dashboard';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.applications = req.session.form.applications;
        return ctx;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.applications;
        return [ctx, formdata];
    }
}

module.exports = Dashboard;
