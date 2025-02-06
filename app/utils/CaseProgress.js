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

    static caseStopped(state) {
        return state === 'BOCaseStopped' || state === 'Dormant';
    }

    static caseClosed(state) {
        return state === 'BOCaseClosed';
    }

    static informationProvided(state, documentUploadIssue, expectedResponseDate) {
        return this.caseStopped(state) && documentUploadIssue !== 'true' && typeof expectedResponseDate !== 'undefined' && expectedResponseDate !== null;
    }

    static partialInformationProvided(state, documentUploadIssue, expectedResponseDate, citizenResponse, uploadedDocuments, isSaveAndClose) {
        return this.caseStopped(state) && documentUploadIssue === 'true' && isSaveAndClose !== 'true' &&
            ((typeof expectedResponseDate !== 'undefined' && expectedResponseDate !== null) ||
                ((typeof uploadedDocuments === 'undefined' || uploadedDocuments.length === 0) &&
                    (typeof citizenResponse === 'undefined' || citizenResponse === '')));
    }
}

module.exports = CaseProgress;
