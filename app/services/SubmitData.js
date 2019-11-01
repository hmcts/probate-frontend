'use strict';

const Service = require('./Service');
const caseTypes = require('app/utils/CaseTypes');

class SubmitData extends Service {
    submit(data, paymentDto, authorisation, serviceAuthorization, caseType) {
        const probateType = caseTypes.getProbateType(caseType);
        const path = this.replacePlaceholderInPath(this.config.services.orchestrator.paths.submissions, 'ccdCaseId', data.ccdCase.id);
        const logMessage = 'Put submit data';
        const url = this.endpoint + path + '?probateType=' + probateType;
        return this.put(logMessage, url, paymentDto, authorisation, serviceAuthorization);
    }

    put(logMessage, url, paymentDto, authorization, serviceAuthorization) {
        this.log(logMessage);
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': authorization,
            'ServiceAuthorization': serviceAuthorization
        };
        const fetchOptions = this.fetchOptions(paymentDto, 'PUT', headers);
        return this.fetchJson(url, fetchOptions);
    }
}

module.exports = SubmitData;
