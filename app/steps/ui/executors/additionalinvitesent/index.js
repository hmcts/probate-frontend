'use strict';

const Step = require('app/core/steps/Step');
const {size} = require('lodash');

class ExecutorsAdditionalInviteSent extends Step {

    static getUrl() {
        return '/executors-additional-invite-sent';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.inviteSuffix = size(ctx.executorsToNotifyList) > 1 ? '-multiple' : '';
        ctx.header = `header${ctx.inviteSuffix}`;
        return ctx;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete formdata.executors.executorsToNotifyList;
        delete ctx.executorsToNotifyList;
        delete ctx.inviteSuffix;
        delete ctx.header;
        return [ctx, formdata];
    }
}

module.exports = ExecutorsAdditionalInviteSent;
