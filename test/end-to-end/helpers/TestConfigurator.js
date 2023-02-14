'use strict';

const randomstring = require('randomstring');
const request = require('request');
const testConfig = require('config');
const LaunchDarkly = require('test/end-to-end/helpers/LaunchDarkly');
const util = require('util');
const setupSecrets = require('../../../app/setupSecrets');

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
        this.launchDarkly = null;
    }

    async initLaunchDarkly() {
        console.log('Opening LaunchDarkly connection...');
        this.launchDarkly = await new LaunchDarkly();
        console.log('LaunchDarkly connection opened.');
    }

    async closeLaunchDarkly() {
        if (this.launchDarkly) {
            console.log('Closing LaunchDarkly connection...');
            await this.launchDarkly.close();
            console.log('LaunchDarkly connection closed.');
        }
    }

    async getBefore() {
        if (process.env.testCitizenEmail === this.getTestCitizenEmail()) {
            this.setTestCitizenName();
            this.setTestCitizenPassword();
        }
        await this.setEnvVarsForIndividualTest();
    }

    async getAfter() {
        await this.deleteIdamUser();
        await this.closeLaunchDarkly();
    }

    setTestCitizenName() {
        this.testCitizenName = randomstring.generate({
            length: 24,
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

    async deleteIdamUser() {
        if (this.useIdam === 'true') {
            const email = this.getTestCitizenEmail();
            console.log(`Deleting user: ${email}`);
            try {
                const httpReq = util.promisify(request);
                const response = await httpReq({
                    url: this.getTestDeleteUserURL() + email,
                    proxy: this.getUseProxy() === 'true' ? this.getProxy() : null,
                    method: 'DELETE'
                });
                if (response.statusCode > 204) {
                    console.log(`Delete IDAM test user '${email}' result: ${response.statusCode}, ${response.statusMessage}`);
                }
            } catch (err) {
                console.error(`IDAM test user deletion unsuccessful: ${err.message}`);
            }
        }
    }

    setEnvVarsForIndividualTest() {
        process.env.testCitizenEmail = this.getTestCitizenEmail();
        process.env.testCitizenPassword = this.getTestCitizenPassword();
    }

    bootStrapTestSuite() {
        if (process.env.NODE_ENV === 'dev-aat') {
            return () => setupSecrets();
        }
    }

    showBrowser() {
        return process.env.TEST_HEADLESS ? process.env.TEST_HEADLESS === 'false' : testConfig.TestShowBrowser;
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
