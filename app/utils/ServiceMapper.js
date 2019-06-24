'use strict';

class ServiceMapper {
    static map(service, params, caseType = 'gop') {
        let prefix;
        switch (caseType) {
        case 'intestacy':
            prefix = 'Intestacy';
            break;
        default:
            prefix = 'Probate';
        }
        const serviceClass = require(`app/services/${prefix}${service}`);
        return new serviceClass(...params);
    }
}

module.exports = ServiceMapper;
