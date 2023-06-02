'use strict';

const Service = require('./Service');
const caseTypes = require('app/utils/CaseTypes');
const AsyncFetch = require('app/utils/AsyncFetch');

class ValidateData extends Service {
    put(data, authorization, serviceAuthorization, caseType) {
        const probateType = caseTypes.getProbateType(caseType);
        this.log('Post validate data');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': authorization,
            'ServiceAuthorization': serviceAuthorization
        };
        const path = this.replacePlaceholderInPath(this.config.services.orchestrator.paths.validations, 'ccdCaseId', data.ccdCase.id);
        const url = this.endpoint + path + '?probateType=' + probateType;
        const fetchOptions = AsyncFetch.fetchOptions({}, 'PUT', headers);
        return AsyncFetch.fetchJson(url, fetchOptions);
    }
}

module.exports = ValidateData;
