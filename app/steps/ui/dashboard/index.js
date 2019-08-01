'use strict';

const Step = require('app/core/steps/Step');

class Dashboard extends Step {

    static getUrl() {
        return '/dashboard';
    }
}

module.exports = Dashboard;
