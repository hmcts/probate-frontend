'use strict';

const Service = require('./Service');
const caseTypes = require('app/utils/CaseTypes');

class Fees extends Service {

    updateFees(data, authorisation, serviceAuthorization, caseType) {
        const probateType = caseTypes.getProbateType(caseType);
        const path = this.replacePlaceholderInPath(this.config.services.orchestrator.paths.fees, 'ccdCaseId', data.ccdCaseId);
        const logMessage = 'Update fees';
        const url = this.endpoint + path + '?probateType=' + probateType;
        return this.post(logMessage, url, authorisation, serviceAuthorization);
    }

    post(logMessage, url, authorization, serviceAuthorization) {
        this.log(logMessage);
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': authorization,
            'ServiceAuthorization': serviceAuthorization
        };
        const fetchOptions = this.fetchOptions({}, 'POST', headers);
        return this.fetchJson(url, fetchOptions);
    }
}

module.exports = Fees;
