'use strict';

class Executors {
    constructor(executorsData) {
        this.executorsData = executorsData || {};
        this.executorsList = this.executorsData.list || [];

    }

    executors(excludeApplicant) {
        const executorsList = this.executorsList;
        return this.excludeApplicant(executorsList, excludeApplicant);
    }

    executorsApplying(excludeApplicant) {
        const executorsList = this.executorsList.filter(executor => executor.isApplying);
        return this.excludeApplicant(executorsList, excludeApplicant);
    }

    executorsNotApplying() {
        return this.executorsList.filter(executor => !executor.isApplying);
    }

    hasMultipleApplicants() {
        return this.executorsList.some(executor => !executor.isApplicant && executor.isApplying);
    }

    hasRenunciated() {
        return this.executorsList.some(executor => executor.notApplyingKey === 'optionRenunciated');
    }

    hasRenunciatedOrPowerReserved() {
        return this.executorsList.some(executor => ['optionPowerReserved', 'optionRenunciated'].includes(executor.notApplyingKey));
    }

    aliveExecutors(excludeApplicant) {
        const executorsList = this.executorsList.filter(executor => !executor.isDead);
        return this.excludeApplicant(executorsList, excludeApplicant);
    }

    hasAliveExecutors() {
        return this.aliveExecutors(true).length > 0;
    }

    excludeApplicant(executorsList, excludeApplicant) {
        if (excludeApplicant) {
            return executorsList.filter(executor => !executor.isApplicant);
        }
        return executorsList;
    }

    executorsInvited() {
        return this.executorsList.filter(executor => executor.inviteId);
    }

    deadExecutors() {
        return this.executorsList.filter(executor => executor.isDead);
    }

    hasOtherName() {
        return this.executorsList.some(executor => executor.hasOtherName === true);
    }

    executorsWithAnotherName() {
        return this.executorsList.filter(executor => executor.hasOtherName === true);
    }

    areAllAliveExecutorsApplying() {
        return this.aliveExecutors().every(executor => executor.isApplying);
    }

    removeExecutorsEmailChangedFlag() {
        return this.executorsList.map(executor => {
            if (executor.emailChanged) {
                delete executor.emailChanged;
            }
            return executor;
        });
    }

    mainApplicant() {
        return this.executorsList.filter(executor => executor.isApplicant);
    }

    executorsToRemove() {
        return this.executorsList.filter(executor => !executor.isApplying && executor.inviteId);
    }

    removeExecutorsInviteData() {
        return this.executorsList.map(executor => {
            if (!executor.isApplying && executor.inviteId) {
                delete executor.inviteId;
                delete executor.emailSent;
            }
            return executor;
        });
    }

    hasExecutorsEmailChanged() {
        return this.executorsList.some(executor => executor.emailChanged);
    }

    executorsEmailChangedList() {
        return this.executorsList.filter(executor => executor.emailChanged);
    }

    hasExecutorsToNotify() {
        return this.executorsList.some(executor => executor.isApplying && !executor.isApplicant && !executor.emailSent);
    }

    executorsToNotify() {
        return this.executorsList.filter(executor => executor.isApplying && !executor.isApplicant && !executor.emailSent);
    }

    executorsRemoved() {
        return this.executorsData.executorsRemoved || [];
    }

    executorsNameChangedByDeedPoll() {
        return this.executorsList
            .filter(executor => executor.aliasReason === 'Change by deed poll' || executor.currentNameReason === 'Change by deed poll')
            .map(executor => executor.alias || executor.currentName);
    }
}

module.exports = Executors;
