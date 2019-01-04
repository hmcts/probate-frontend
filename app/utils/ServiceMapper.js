'use strict';

class ServiceMapper {
    static map(service, params, journeyType = 'Probate') {
        const serviceClass = require(`app/services/${journeyType}${service}`);
        return new serviceClass(...params);
    }
}

module.exports = ServiceMapper;
