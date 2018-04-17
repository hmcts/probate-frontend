/*global require, module, process */
'use strict';
const bunyan = require('bunyan');
let logger;

const log = (logId) => {
            if (!logger) {
                logger = bunyan.createLogger({
                        name: 'frontend',
                        streams: [{
                            level: process.env.LOG_LEVEL || 'debug',
                            stream: process.stdout
                        }
                    ]
                    });
            }
            logger.fields.id = logId;
            return logger;
        };

module.exports = log;
