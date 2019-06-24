'use strict';
const caseTypes = require('app/utils/CaseTypes');

class ServiceMapper {
    static map(service, params, caseType = caseTypes.GOP) {
        let prefix;
        switch (caseType) {
        case caseTypes.INTESTACY:
            prefix = 'Intestacy';
            break;
        case caseTypes.GOP:
            prefix = 'Probate';
            break;
        default:
            throw new Error('Unable to identify caseType: ' + caseType);
        }
        const serviceClass = require(`app/services/${prefix}${service}`);
        return new serviceClass(...params);
    }
}

module.exports = ServiceMapper;
