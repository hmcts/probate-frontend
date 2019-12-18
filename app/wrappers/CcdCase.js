'use strict';

class CcdCase {
    constructor(ccdCaseData) {
        this.ccdCaseData = ccdCaseData || {};
    }

    applicationSubmitted() {
        return this.ccdCaseData.state === 'CaseCreated';
    }
}

module.exports = CcdCase;
