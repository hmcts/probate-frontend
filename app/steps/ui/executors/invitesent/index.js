const Step = require('app/core/steps/Step');

module.exports = class ExecutorsInvitesSent extends Step {

    static getUrl () {
        return '/executors-invites-sent';
    }
};
