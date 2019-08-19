'use strict';

const Step = require('app/core/steps/Step');
// const config = require('app/config');
// const MultipleApplications = require('app/services/MultipleApplications');
const content = require('app/resources/en/translation/dashboard');

class Dashboard extends Step {

    static getUrl() {
        return '/dashboard';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.applications = this.getApplications(req, ctx);

        return ctx;
    }

    // getApplications(req, ctx) {
    //     const email = req.session.email;
    //     const applications = new MultipleApplications(config.services.multipleApplicatons.url, ctx.sessionId);
    //     return applications.get(email);
    // }

    getApplications() {
        return [{
            deceasedFullName: 'Bob Jones',
            dateCreated: '7 October 2018',
            status: content.statusInProgress
        }, {
            deceasedFullName: 'Tom Smith',
            dateCreated: '24 February 2019',
            status: content.statusSubmitted
        }];
    }
}

module.exports = Dashboard;
