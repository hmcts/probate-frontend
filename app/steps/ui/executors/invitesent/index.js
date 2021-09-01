'use strict';

const Step = require('app/core/steps/Step');

class ExecutorsInvitesSent extends Step {

    static getUrl () {
        return '/executors-invites-sent*';
    }
}

module.exports = ExecutorsInvitesSent;
