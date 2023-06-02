'use strict';

const config = require('config');
const logger = require('app/components/logger');
const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');
const log = logger('Init');

class AsyncFetch {
    static buildRequest(url, fetchOptions) {
        return new fetch.Request(url, fetchOptions);
    }

    static retryOptions() {
        return {
            retries: config.utils.api.retries,
            retryDelay: config.utils.api.retryDelay
        };
    }

    static isHealthEndpoint(url) {
        return url.endsWith('health') || url.endsWith('info');
    }

    static fetch(url, fetchOptions, parseBody) {
        if (!AsyncFetch.isHealthEndpoint(url)) {
            log.info('Calling external service');
        }

        return new Promise((resolve, reject) => {
            const asyncReq = AsyncFetch.buildRequest(url, fetchOptions);
            fetch(asyncReq, AsyncFetch.retryOptions())
                .then(res => {
                    if (!AsyncFetch.isHealthEndpoint(url)) {
                        log.info(`Status: ${res.status}`);
                    }
                    if (res.ok) {
                        return parseBody(res);
                    }
                    if (res.status === 400) {
                        log.error(res.statusText);
                        return parseBody(res)
                            .then(body => {
                                AsyncFetch.logBody(body);
                                return body;
                            });
                    }
                    log.error(res.statusText);
                    return parseBody(res)
                        .then(body => {
                            AsyncFetch.logBody(body);
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

    static logBody(body) {
        try {
            if (body instanceof Buffer) {
                logger.error(body.toLocaleString());
            } else {
                const json = JSON.stringify(body);
                log.error(json);
            }
        } catch (e) {
            log.error(body);
        }
    }

    static fetchOptions(data, method, headers, proxy) {
        const options = {
            method: method,
            mode: 'cors',
            redirect: 'follow',
            follow: 10,
            timeout: 10000,
            headers: new fetch.Headers(headers),
            agent: proxy ? new HttpsProxyAgent(proxy) : null
        };
        if (method !== 'GET') {
            options.body = JSON.stringify(data);
        }
        return options;
    }

    static fetchJson(url, fetchOptions) {
        return AsyncFetch.fetch(url, fetchOptions, res => res.json())
            .then(json => json)
            .catch(err => err);
    }
}

module.exports = AsyncFetch;
