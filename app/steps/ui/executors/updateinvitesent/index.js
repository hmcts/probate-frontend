'use strict';

const Step = require('app/core/steps/Step');

class ExecutorsUpdateInviteSent extends Step {

    static getUrl() {
        return '/executors-update-invite-sent*';
    }
}

module.exports = ExecutorsUpdateInviteSent;
