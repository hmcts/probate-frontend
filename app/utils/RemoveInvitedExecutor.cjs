'use strict';

const ExecutorsWrapper = require('app/wrappers/Executors.cjs');
const logger = require('app/components/logger.cjs')('Init');
const InviteData = require('app/services/InviteData.cjs');
const config = require('config');

class RemoveInvitedExecutor {
    static remove(req) {
        const formdata = req.session.form;
        const ccdCaseId = formdata.ccdCase ? formdata.ccdCase.id : '';
        const executorsWrapper = new ExecutorsWrapper(formdata.executors);
        const executorsRemoved = executorsWrapper.executorsRemoved();
        const executorsToRemoveFromInviteData = executorsRemoved.concat(executorsWrapper.executorsToRemove());

        if (executorsToRemoveFromInviteData.length === 0) {
            return Promise.resolve(formdata.executors);
        }

        const inviteData = new InviteData(config.services.orchestrator.url, req.sessionID);
        const promises = executorsToRemoveFromInviteData.map(exec => inviteData.delete(ccdCaseId, {
            inviteId: exec.inviteId
        }));
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
