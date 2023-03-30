'use strict';

const logger = require('app/components/logger');
const config = require('config');
const formatUrl = require('app/utils/FormatUrl');
const AsyncFetch = require('app/utils/AsyncFetch');

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

    fetchText(url, fetchOptions) {
        return AsyncFetch
            .fetch(url, fetchOptions, res => res.text())
            .then(text => text)
            .catch(err => err);
    }

    fetchBuffer(url, fetchOptions) {
        return AsyncFetch
            .fetch(url, fetchOptions, res => res.buffer())
            .then(buffer => buffer)
            .catch(err => {
                this.log(`Fetch buffer error: ${this.formatErrorMessage(err)}`, 'error');
                throw new Error(err);
            });
    }
    formatErrorMessage(error) {
        return error.toString();
    }
}

module.exports = Service;
