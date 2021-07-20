'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');
const logger = require('app/components/logger')('Init');
const InviteLink = require('app/services/InviteLink');
const config = require('config');
const get = require('lodash').get;

class ExecutorsInvite extends ValidationStep {

    static getUrl() {
        return '/executors-invite';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.inviteSuffix = ctx.executorsNumber > 2 ? '-multiple' : '';
        ctx.authToken = req.authToken;
        ctx.serviceAuthorization = req.session.serviceAuthorization;
        return ctx;
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl();
    }

    shouldPersistFormData() {
        return false;
    }

    * handlePost(ctx, errors, formdata) {
        logger.info('handlePost method for /executor-invites initiated for case ID ' + (ctx !== null ? ctx.ccdCase.id : ''));
        const inviteLink = new InviteLink(config.services.orchestrator.url, ctx.sessionID);
        const executorsToNotifyList = ctx.list
            .filter(exec => exec.isApplying && !exec.isApplicant)
            .map(exec => {
                return {
                    executorName: exec.fullName,
                    firstName: formdata.deceased.firstName,
                    lastName: formdata.deceased.lastName,
                    email: exec.email,
                    phoneNumber: exec.mobile,
                    formdataId: formdata.ccdCase.id,
                    leadExecutorName: FormatName.format(formdata.applicant)
                };
            });

        if (executorsToNotifyList.length) {
            const bilingual = get(formdata, 'language.bilingual', 'optionNo') === 'optionYes';

            yield inviteLink.post(executorsToNotifyList, ctx.authToken, ctx.serviceAuthorization, bilingual)
                .then(result => {
                    if (result.name === 'Error') {
                        logger.error(`Error while sending executor email invites: ${result}`);
                        throw new ReferenceError('Error while sending co-applicant invitation emails.');
                    } else {
                        result.invitations.forEach((execResult) => {
                            const result = {
                                inviteId: execResult.inviteId,
                                emailSent: true
                            };

                            Object.assign(ctx.list.find(execList => execList.email === execResult.email && execList.fullName === execResult.executorName), result);
                        });
                    }
                });
        }

        yield new Promise((resolve) => resolve())
            .then(() => {
                return true;
            });

        ctx.invitesSent = 'true';
        return [ctx, errors];
    }

    isComplete(ctx) {
        return [ctx.invitesSent, 'inProgress'];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.inviteSuffix;
        delete ctx.serviceAuthorization;
        delete ctx.authToken;
        return [ctx, formdata];
    }
}

module.exports = ExecutorsInvite;
