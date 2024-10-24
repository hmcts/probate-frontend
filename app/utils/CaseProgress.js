'use strict';

class CaseProgress {
    static applicationSubmitted(state) {
        return !(state === 'Pending' || state === 'PAAppCreated' || state === 'CasePaymentFailed');
    }
    static grantIssued(state) {
        return (state === 'BOGrantIssued' || state === 'BOPostGrantIssued');
    }

    static applicationInReview(state) {
        return this.applicationSubmitted(state) && state !== 'CasePrinted';
    }

    static documentsReceived(state, documentsReceivedNotificationSent) {
        return this.applicationSubmitted(state) && (this.applicationInReview(state) || documentsReceivedNotificationSent === 'true');
    }

    static caseStopped(state, citizenResponseSubmittedDate) {
        return (state === 'BOCaseStopped' || state === 'Dormant') && (typeof citizenResponseSubmittedDate === 'undefined' || citizenResponseSubmittedDate === null);
    }

    static caseClosed(state) {
        return state === 'BOCaseClosed';
    }

    static informationProvided(state, documentUploadIssue, citizenResponseSubmittedDate) {
        return (state === 'BOCaseStopped' || state === 'Dormant') && documentUploadIssue !== 'true' && (typeof citizenResponseSubmittedDate !== 'undefined');
    }

    static partialInformationProvided(state, documentUploadIssue, citizenResponseSubmittedDate) {
        return (state === 'BOCaseStopped' || state === 'Dormant') && documentUploadIssue === 'true' && (typeof citizenResponseSubmittedDate !== 'undefined');
    }
}

module.exports = CaseProgress;
