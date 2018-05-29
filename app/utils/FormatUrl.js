'use strict';

const url = require('url');
const logger = require('app/components/logger')('Init');

class FormatUrl {
    static format(serviceUrl, servicePath = '') {
        logger.info(`serviceUrl: ${serviceUrl}`);
        logger.info(`servicePath: ${servicePath}`);
        const urlParts = url.parse(serviceUrl);
        const port = urlParts.port ? `:${urlParts.port}` : '';
        let path = servicePath || urlParts.path;
        path = path !== '/' ? path : '';
        logger.info(`formattedUrl: ${urlParts.protocol}//${urlParts.hostname}${port}${path}`);
        return `${urlParts.protocol}//${urlParts.hostname}${port}${path}`;
    }
}

module.exports = FormatUrl;
