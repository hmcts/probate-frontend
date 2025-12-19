'use strict';

class CcdCase {
    constructor(ccdCaseData) {
        this.ccdCaseData = ccdCaseData || {};
    }

    applicationSubmitted() {
        return !(this.ccdCaseData.state === 'Pending' || this.ccdCaseData.state === 'PAAppCreated' || this.ccdCaseData.state === 'CasePaymentFailed');
    }
}

module.exports = CcdCase;
