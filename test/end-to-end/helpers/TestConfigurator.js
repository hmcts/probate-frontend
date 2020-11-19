'use strict';

const randomstring = require('randomstring');
const request = require('request');
const testConfig = require('config');
const LaunchDarkly = require('test/end-to-end/helpers/LaunchDarkly');

/* eslint no-console: 0 no-unused-vars: 0 */
/* eslint-disable no-undef */
class TestConfigurator {

    constructor() {
        this.environment = testConfig.TestFrontendUrl.includes('local') ? 'local' : 'aat';
        this.testBaseUrl = testConfig.TestIdamBaseUrl;
        this.useIdam = testConfig.TestUseIdam;
        this.setTestCitizenName();
        this.testCitizenDomain = testConfig.TestCitizenDomain.replace('/@', '@');
        this.setTestCitizenPassword();
        this.testAddUserUrl = testConfig.TestIdamAddUserUrl;
        this.testDeleteUserUrl = this.testAddUserUrl + '/';
        this.role = testConfig.TestIdamRole;
        this.testIdamUserGroup = testConfig.TestIdamUserGroup;
        this.useGovPay = testConfig.TestUseGovPay;
        this.userDetails = '';
        this.retryFeatures = testConfig.TestRetryFeatures;
        this.retryScenarios = testConfig.TestRetryScenarios;
        this.testUseProxy = testConfig.TestUseProxy;
        this.testProxy = testConfig.TestProxy;
        this.launchDarkly = new LaunchDarkly();
    }

    getBefore() {
        if (process.env.testCitizenEmail === this.getTestCitizenEmail()) {
            this.setTestCitizenName();
            this.setTestCitizenPassword();
        }

        this.setEnvVars();

        if (this.useIdam === 'true') {
            this.userDetails =
                {
                    'email': this.getTestCitizenEmail(),
                    'forename': this.getTestCitizenName(),
                    'surname': this.getTestCitizenName(),
                    'password': this.getTestCitizenPassword(),
                    'roles': [{'code': this.getTestRole()}],
                    'userGroup': {'code': this.getTestIdamUserGroup()}
                };

            if (this.getUseProxy() === 'true') {
                request({
                    url: this.getTestAddUserURL(),
                    proxy: this.getProxy(),
                    method: 'POST',
                    json: true, // <--Very important!!!
                    body: this.userDetails
                }, (error, response, body) => {
                    if (response && response.statusCode !== 201) {
                        throw new Error('TestConfigurator.getBefore: Using proxy - Unable to create user.  Response from IDAM was: ' + response.statusCode);
                    } else {
                        console.log('User created (via proxy)', this.userDetails);
                    }
                });
            } else {
                request({
                    url: this.getTestAddUserURL(),
                    method: 'POST',
                    json: true, // <--Very important!!!
                    body: this.userDetails
                }, (error, response, body) => {
                    if (response && response.statusCode !== 201) {
                        throw new Error('TestConfigurator.getBefore: Without proxy - Unable to create user.  Response from IDAM was: ' + response.statusCode);
                    } else {
                        console.log('User created', this.userDetails);
                    }
                });
            }
        }

    }

    getAfter() {
        this.launchDarkly.close();
    }

    setTestCitizenName() {
        this.testCitizenName = randomstring.generate({
            length: 36,
            charset: 'alphabetic'
        });
    }

    getTestCitizenName() {
        return this.testCitizenName;
    }

    getTestCitizenPassword() {
        return this.testCitizenPassword;
    }

    setTestCitizenPassword() {
        const letters = randomstring.generate({length: 5, charset: 'alphabetic'});
        const captiliseFirstLetter = letters.charAt(0).toUpperCase();

        this.testCitizenPassword = captiliseFirstLetter + letters.slice(1) + randomstring.generate({length: 4, charset: 'numeric'});
    }

    getTestRole() {
        return this.role;
    }

    getTestIdamUserGroup() {
        return this.testIdamUserGroup;
    }

    getTestCitizenEmail() {
        return this.testCitizenName + this.testCitizenDomain;
    }

    getTestAddUserURL() {
        return this.testBaseUrl + this.testAddUserUrl;
    }

    getTestDeleteUserURL() {
        return this.testBaseUrl + this.testDeleteUserUrl;
    }

    idamInUseText(scenarioText) {
        return (this.useIdam === 'true') ? scenarioText + ' - With Idam' : scenarioText + ' - Without Idam';
    }

    setEnvVars() {
        process.env.testCitizenEmail = this.getTestCitizenEmail();
        process.env.testCitizenPassword = this.getTestCitizenPassword();
    }

    resetEnvVars() {
        process.env.testCitizenEmail = null;
        process.env.testCitizenPassword = null;
    }

    getUseGovPay() {
        return this.useGovPay;
    }

    getRetryFeatures() {
        return this.retryFeatures;
    }

    getRetryScenarios() {
        return this.retryScenarios;
    }

    getUseProxy() {
        return this.testUseProxy;
    }

    getProxy() {
        return this.testProxy;
    }

    equalityAndDiversityEnabled() {
        return this.environment !== 'local';
    }

    checkFeatureToggle(featureToggleKey) {
        return this.launchDarkly.variation(featureToggleKey, testConfig.featureToggles.launchDarklyUser, false);
    }
}

module.exports = TestConfigurator;