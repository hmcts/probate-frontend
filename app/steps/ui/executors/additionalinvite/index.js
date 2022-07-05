'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');
const {size} = require('lodash');
const ExecutorsWrapper = require('app/wrappers/Executors');

class ExecutorsAdditionalInvite extends ValidationStep {

    static getUrl() {
        return '/executors-additional-invite';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.executorsToNotifyList = new ExecutorsWrapper(ctx).executorsToNotify();
        ctx.inviteSuffix = size(ctx.executorsToNotifyList) > 1 ? '-multiple' : '';
        ctx.executorsToNotifyNames = FormatName.formatExecutorNames(ctx.executorsToNotifyList);
        ctx.authToken = req.authToken;
        ctx.serviceAuthorization = req.session.serviceAuthorization;
        return ctx;
    }

    isComplete(ctx) {
        const executorsWrapper = new ExecutorsWrapper(ctx);
        return [executorsWrapper.executors(true).every(exec => exec.isApplying && (exec.emailSent || exec.inviteId)) && ctx.invitesSent === 'true', 'inProgress'];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.inviteSuffix;
        delete ctx.executorsToNotifyNames;
        delete ctx.serviceAuthorization;
        delete ctx.authToken;
        return [ctx, formdata];
    }
}

module.exports = ExecutorsAdditionalInvite;
