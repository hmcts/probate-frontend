'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const ExecutorsWrapper = require('app/wrappers/Executors');
const FormatName = require('app/utils/FormatName');
const logger = require('app/components/logger')('Init');
const InviteLink = require('app/services/InviteLink');
const config = require('config');

class ExecutorsUpdateInvite extends ValidationStep {

    static getUrl() {
        return '/executors-update-invite';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        const executorsWrapper = new ExecutorsWrapper(formdata.executors);
        ctx.executorsEmailChangedList = executorsWrapper.executorsEmailChangedList();
        ctx.inviteSuffix = ctx.executorsEmailChangedList.length > 1 ? '-multiple' : '';
        ctx.authToken = req.authToken;
        ctx.serviceAuthorization = req.session.serviceAuthorization;
        return ctx;
    }

    * handlePost(ctx, errors, formdata) {
        const inviteLink = new InviteLink(config.services.orchestrator.url, ctx.sessionID);
        const executorsWrapper = new ExecutorsWrapper(formdata.executors);
        formdata.executors.list = executorsWrapper.addExecutorIds();
        let executorsToNotifyList = executorsWrapper.executorsEmailChangedList();

        executorsToNotifyList = executorsToNotifyList
            .map(exec => {
                return {
                    executorName: exec.fullName,
                    firstName: formdata.deceased.firstName,
                    lastName: formdata.deceased.lastName,
                    email: exec.email,
                    inviteId: exec.inviteId,
                    phoneNumber: exec.mobile,
                    formdataId: formdata.ccdCase.id,
                    leadExecutorName: FormatName.format(formdata.applicant)
                };
            });

        if (executorsToNotifyList.length) {
            yield inviteLink.post(executorsToNotifyList, ctx.authToken, ctx.serviceAuthorization)
                .then(result => {
                    if (result.name === 'Error') {
                        logger.error(`Error while sending executor email invites: ${result}`);
                        throw new ReferenceError('Error while sending co-applicant invitation emails.');
                    } else {
                        result.invitations.forEach((execResult) => {
                            const result = {
                                inviteId: execResult.inviteId
                            };
                            Object.assign(formdata.executors.list.find(execList => execList.email === execResult.email && execList.fullName === execResult.executorName), result);
                        });
                        formdata.executors.list = executorsWrapper.removeExecutorsEmailChangedFlag();
                    }
                });
        }

        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.executorsEmailChanged;
        delete ctx.executorsEmailChangedList;
        delete ctx.inviteSuffix;
        return [ctx, formdata];
    }

    isComplete(ctx) {
        return [ctx.hasEmailChanged, 'inProgress'];
    }
}

module.exports = ExecutorsUpdateInvite;
