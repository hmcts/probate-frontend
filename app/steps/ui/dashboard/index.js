'use strict';

const Step = require('app/core/steps/Step');
const content = require('app/resources/en/translation/dashboard');

class Dashboard extends Step {

    static getUrl() {
        return '/dashboard';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);

        ctx.applications = [{
            deceasedFullName: 'Bob Jones',
            dateCreated: '7 October 2018',
            status: content.statusInProgress
        }, {
            deceasedFullName: 'Tom Smith',
            dateCreated: '24 February 2019',
            status: content.statusSubmitted
        }];

        return ctx;
    }
}

module.exports = Dashboard;
