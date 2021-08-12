'use strict';

const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');
const logger = require('app/components/logger');
const config = require('config');
const formatUrl = require('app/utils/FormatUrl');
const AsyncFetch = require('app/utils/AsyncFetch');
const asyncFetch = new AsyncFetch();

class Service {
    constructor(endpoint, sessionId) {
        this.endpoint = endpoint;
        this.sessionId = sessionId;
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

    log(message, level = 'info') {
        const sessionId = this.sessionId ? this.sessionId : 'Init';
        logger(sessionId)[level](message);
    }

    replacePlaceholderInPath(path, placeholder, value) {
        return path.replace(`{${placeholder}}`, value);
    }

    fetchJson(url, fetchOptions) {
        console.log('================== fetchJson', url);
        console.log('request body=> ', fetchOptions.body);
        return asyncFetch
            .fetch(url, fetchOptions, res => res.json())
            .then(json => {
                console.log('response=> ', json);
                return json;
            })
            .catch(err => {
                console.log('error=> ', err);
                return err;
            });
    }

    fetchText(url, fetchOptions) {
        return asyncFetch
            .fetch(url, fetchOptions, res => res.text())
            .then(text => text)
            .catch(err => err);
    }

    fetchBuffer(url, fetchOptions) {
        return asyncFetch
            .fetch(url, fetchOptions, res => res.buffer())
            .then(buffer => buffer)
            .catch(err => {
                this.log(`Fetch buffer error: ${this.formatErrorMessage(err)}`, 'error');
                throw new Error(err);
            });
    }

    fetchOptions(data, method, headers, proxy) {
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

    formatErrorMessage(error) {
        return error.toString();
    }
}

module.exports = Service;
