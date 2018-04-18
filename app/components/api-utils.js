'use strict';
const logger = require('app/components/logger')('Init');
const {endsWith} = require('lodash');

const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');

const fetchJson = function (url, fetchOptions) {
    return asyncFetch(url, fetchOptions, res => res.json())
        .then(json => json)
        .catch(err => err);
};

const fetchText = function (url, fetchOptions) {
    return asyncFetch(url, fetchOptions, res => res.text())
        .then(text => text)
        .catch(err => err);
};

const asyncFetch = function (url, fetchOptions, parseBody) {
    if (!endsWith(url, 'health')) {
        logger.info('Calling external service');
    }

    return new Promise(function (resolve, reject) {
        const asyncReq = buildRequest(url, fetchOptions);
        fetch(asyncReq, retryOptions())
            .then(res => {
                if (!endsWith(url, 'health')) {
                    logger.info('Status: ' + res.status);
                }
                if (res.ok) {
                    return parseBody(res);
                }
                    logger.error(res.statusText);
                    return parseBody(res)
                        .then(body => {
                            logger.error(body);
                            reject(new Error(res.statusText));
                        });

            })
            .then(body => {
                resolve(body);
            })
            .catch(err => {
                logger.error('Error' + err);
                reject(Error(err));
            });
    });
};

const buildRequest = function (url, fetchOptions) {
    return new fetch.Request(url, fetchOptions);
};

const fetchOptions = function (data, method, headers, proxy) {
    return {
        method: method,
        mode: 'cors',
        redirect: 'follow',
        follow: 10,
        timeout: 10000,
        body: JSON.stringify(data),
        headers: new fetch.Headers(headers),
        agent: proxy ? new HttpsProxyAgent(proxy) : null
    };
};

const retryOptions = function () {
    return {
        retries: process.env.RETRIES_NUMBER || 10,
        retryDelay: process.env.RETRY_DELAY || 1000
    };
};

module.exports = {
    fetchOptions: fetchOptions,
    fetchJson: fetchJson,
    asyncFetch: asyncFetch,
    fetchText: fetchText
};
