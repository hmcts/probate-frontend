'use strict';

class ServiceMapper {
    static map(service, params) {
        const serviceClass = require(`app/services/${service}`);
        return new serviceClass(...params);
    }
}

module.exports = ServiceMapper;
