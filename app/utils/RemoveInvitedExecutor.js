'use strict';

const ExecutorsWrapper = require('app/wrappers/Executors');
const logger = require('app/components/logger')('Init');
const InviteData = require('app/services/InviteData');
const config = require('app/config');

class RemoveInvitedExecutor {
    static remove(req) {
        const formdata = req.session.form;
        const executorsWrapper = new ExecutorsWrapper(formdata.executors);
        const executorsRemoved = executorsWrapper.executorsRemoved();
        const executorsToRemoveFromInviteData = executorsRemoved.concat(executorsWrapper.executorsToRemove());

        if (executorsToRemoveFromInviteData.length === 0) {
            return Promise.resolve(formdata.executors);
        }

        const inviteData = new InviteData(config.services.persistence.url, req.sessionID);
        const promises = executorsToRemoveFromInviteData.map(exec => inviteData.delete(exec.inviteId));
        return Promise.all(promises).then(result => {
            const isError = result.some(r => r !== '');
            if (isError) {
                logger.error(`Error while deleting executor from invitedata table: ${result}`);
                throw new Error('Error while deleting executor from invitedata table.');
            }
            formdata.executors.list = executorsWrapper.removeExecutorsInviteData();
            delete formdata.executors.executorsRemoved;
            return formdata.executors;
        });
    }
}

module.exports = RemoveInvitedExecutor;
