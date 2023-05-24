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

    static documentsReceived(state) {
        return this.applicationSubmitted(state) && this.applicationInReview(state);
    }

    static caseStopped(state) {
        return (state === 'BOCaseStopped' || state === 'Dormant');
    }

    static caseClosed(state) {
        return state === 'BOCaseClosed';
    }
}

module.exports = CaseProgress;
