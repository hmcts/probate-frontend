'use strict';

const ExecutorsWrapper = require('app/wrappers/Executors');
const FormatName = require('app/utils/FormatName');
const logger = require('app/components/logger')('Init');
const InviteLink = require('app/services/InviteLink');
const config = require('config');

class UpdateExecutorInvite {
    static update(req) {
        const session = req.session;
        const formdata = req.session.form;
        const inviteLink = new InviteLink(config.services.orchestrator.url, session.id);
        const executorsWrapper = new ExecutorsWrapper(formdata.executors);
        formdata.executors.list = executorsWrapper.addExecutorIds();
        let executorsToNotifyList = executorsWrapper.executorsEmailChangedList();

        executorsToNotifyList = executorsToNotifyList
            .map(exec => {
                return {
                    id: exec.id,
                    executorName: exec.fullName,
                    firstName: formdata.deceased.firstName,
                    lastName: formdata.deceased.lastName,
                    email: exec.email,
                    phoneNumber: exec.mobile,
                    formdataId: session.regId,
                    leadExecutorName: FormatName.format(formdata.applicant)
                };
            });

        if (executorsToNotifyList.length) {
            console.log('executorsToNotifyList= '+executorsToNotifyList+'\nreq.authToken= '+req.authToken+'\nreq.session.serviceAuthorization= '+req.session.serviceAuthorization);
            return inviteLink.post(executorsToNotifyList, req.authToken, req.session.serviceAuthorization)
                .then(result => {
                    if (result.name === 'Error') {
                        logger.error(`Error while sending executor email invites: ${result}`);
                        throw new ReferenceError('Error while sending co-applicant invitation emails.');
                    } else {
                        result.invitations.forEach((execResult) => {
                            const result = {
                                inviteId: execResult.inviteId
                            };

                            Object.assign(formdata.executors.list.find(execList => execList.id === execResult.id), result);
                        });

                        formdata.executors.list = executorsWrapper.removeExecutorIds();
                        formdata.executors.list = executorsWrapper.removeExecutorsEmailChangedFlag();

                        return formdata.executors;
                    }
                });
        }

        return new Promise((resolve) => resolve())
            .then(() => {
                formdata.executors.list = executorsWrapper.removeExecutorIds();
                return formdata.executors;
            });
    }
}

module.exports = UpdateExecutorInvite;
