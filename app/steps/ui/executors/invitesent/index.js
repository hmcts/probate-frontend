'use strict';

const Step = require('app/core/steps/Step');
const caseTypes = require('../../../../utils/CaseTypes');

class ExecutorsInvitesSent extends Step {

    static getUrl () {
        return '/executors-invites-sent';
    }
    getContextData(req) {
        const ctx = super.getContextData(req);
        const session = req.session;
        ctx.caseType = caseTypes.getCaseType(session);
        return ctx;
    }
    shouldHaveBackLink() {
        return false;
    }
}

module.exports = ExecutorsInvitesSent;
