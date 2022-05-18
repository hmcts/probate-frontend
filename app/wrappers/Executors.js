'use strict';

class Executors {
    constructor(executorsData, haveAllExecutorsDeclared) {
        this.executorsData = executorsData || {};
        this.allExecutorsHaveDeclared = haveAllExecutorsDeclared || 'false';
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

    executorPhoneNumberAlreadyUsed(mobile, fullName, applicantPhoneNumber = '') {
        return applicantPhoneNumber.slice(-10) === mobile.slice(-10) ||
            this.executorsList
                .filter(executor => executor.mobile)
                .filter(executor => executor.fullName !== fullName)
                .some(executor => executor.mobile.slice(-10) === mobile.slice(-10));
    }

    executorEmailAlreadyUsed(email, fullName, applicantEmail = '') {
        return applicantEmail.toLowerCase() === email.toLowerCase() || this.executorsList
            .filter(executor => executor.email)
            .filter(executor => executor.fullName !== fullName)
            .some(executor => executor.email.toLowerCase() === email.toLowerCase());
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
        return this.executorsList.some(executor => executor.isApplying && !executor.isApplicant && (!executor.emailSent || !executor.inviteId));
    }

    executorsToNotify() {
        return this.executorsList.filter(executor => executor.isApplying && !executor.isApplicant && (!executor.emailSent || !executor.inviteId));
    }

    executorsRemoved() {
        return this.executorsData.executorsRemoved || [];
    }

    executorsNameChangedByDeedPoll() {
        return this.executorsList
            .filter(executor => executor.aliasReason === 'optionDeedPoll' || executor.currentNameReason === 'optionDeedPoll')
            .map(executor => executor.alias || executor.currentName);
    }

    addExecutorIds() {
        return this.executorsList.map((executor, id) => {
            executor.id = id;
            return executor;
        });
    }

    removeExecutorIds() {
        return this.executorsList.map(executor => {
            delete executor.id;
            return executor;
        });
    }

    invitesSent() {
        return (this.executorsData.invitesSent || false).toString() === 'true';
    }

    haveAllExecutorsDeclared() {
        return (this.allExecutorsHaveDeclared || false).toString() === 'true';
    }
}

module.exports = Executors;
