'use strict';

const config = require('config');
const logger = require('app/components/logger');
const fetch = require('node-fetch');
const log = logger('Init');

class AsyncFetch {
    buildRequest(url, fetchOptions) {
        return new fetch.Request(url, fetchOptions);
    }

    retryOptions() {
        return {
            retries: config.utils.api.retries,
            retryDelay: config.utils.api.retryDelay
        };
    }

    isHealthEndpoint(url) {
        return url.endsWith('health');
    }

    fetch(url, fetchOptions, parseBody) {
        if (!this.isHealthEndpoint(url)) {
            log.info('Calling external service');
        }

        return new Promise((resolve, reject) => {
            const asyncReq = this.buildRequest(url, fetchOptions);
            console.log('URL => ' + url);
            console.log('Fetch Options-------');
            console.log(fetchOptions);
            fetch(asyncReq, this.retryOptions())
                .then(res => {
                    console.log('res==========');
                    console.log(res);
                    if (!this.isHealthEndpoint(url)) {
                        log.info(`Status: ${res.status}`);
                    }
                    if (res.ok) {
                        return parseBody(res);
                    }
                    if (res.status === 400) {
                        log.error(res.statusText);
                        return parseBody(res)
                            .then(body => {
                                this.logBody(body);
                                return body;
                            });
                    }
                    log.error(res.statusText);
                    return parseBody(res)
                        .then(body => {
                            this.logBody(body);
                            reject(new Error(res.statusText));
                        });

                })
                .then(body => {
                    resolve(body);
                })
                .catch(err => {
                    log.error(`Error${err}`);
                    reject(Error(err));
                });
        });
    }

    logBody(body) {
        try {
            const json = JSON.stringify(body);
            log.error(json);
        } catch (e) {
            log.error(body);
        }
    }
}

module.exports = AsyncFetch;
