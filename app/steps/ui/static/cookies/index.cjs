'use strict';

const Step = require('app/core/steps/Step.cjs');
const config = require('config');

class Cookies extends Step {

    constructor(steps, section, resourcePath, i18next, schema, language = 'en') {
        super(steps, section, resourcePath, i18next, schema, language);
        this.SECURITY_COOKIE = `__auth-token-${config.payloadVersion}`;
    }

    static getUrl () {
        return '/cookies';
    }
}

module.exports = Cookies;
