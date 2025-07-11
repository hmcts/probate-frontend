'use strict';

const Step = require('app/core/steps/Step');

class ExecutorsInvitesSent extends Step {

    static getUrl () {
        return '/executors-invites-sent';
    }

    shouldHaveBackLink() {
        return false;
    }
}

module.exports = ExecutorsInvitesSent;
