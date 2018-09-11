'use strict';

const ExecutorsWrapper = require('app/wrappers/Executors');
const services = require('app/components/services');
const logger = require('app/components/logger')();

class RemoveInvitedExecutor {
    static remove(executors) {
        const executorsWrapper = new ExecutorsWrapper(executors);
        const executorsRemoved = executorsWrapper.executorsRemoved();
        const executorsToRemoveFromInviteData = executorsRemoved.concat(executorsWrapper.executorsToRemove());

        if (executorsToRemoveFromInviteData.length === 0) {
            return Promise.resolve(executors);
        }

        const promises = executorsToRemoveFromInviteData.map(exec => services.removeExecutor(exec.inviteId));
        return Promise.all(promises).then(result => {
            const isError = result.some(r => r !== '');
            if (isError) {
                logger.error(`Error while deleting executor from invitedata table: ${result}`);
                throw new Error('Error while deleting executor from invitedata table.');
            }
            executors.list = executorsWrapper.removeExecutorsInviteData();
            delete executors.executorsRemoved;
            return executors;
        });
    }
}

module.exports = RemoveInvitedExecutor;
