'use strict';

const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');
const logger = require('app/components/logger');
const config = require('app/config');
const formatUrl = require('app/utils/FormatUrl');
const AsyncFetch = require('app/utils/AsyncFetch');
const asyncFetch = new AsyncFetch();

class Service {
    constructor(endpoint) {
        this.endpoint = endpoint;
        this.config = config;
        this.formatUrl = formatUrl;
    }

    get() {
        throw new ReferenceError('get() must be overridden when extending Service');
    }

    post() {
        throw new ReferenceError('post() must be overridden when extending Service');
    }

    patch() {
        throw new ReferenceError('patch() must be overridden when extending Service');
    }

    delete() {
        throw new ReferenceError('delete() must be overridden when extending Service');
    }

    log(message, sessionId = 'Init') {
        logger(sessionId).info(message);
    }

    fetchJson(url, fetchOptions) {
        return asyncFetch
            .fetch(url, fetchOptions, res => res.json())
            .then(json => json)
            .catch(err => err);
    }

    fetchText(url, fetchOptions) {
        return asyncFetch
            .fetch(url, fetchOptions, res => res.text())
            .then(text => text)
            .catch(err => err);
    }

    fetchOptions(data, method, headers, proxy) {
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
    }
}

module.exports = Service;
