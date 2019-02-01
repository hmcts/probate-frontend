'use strict';

const randomstring = require('randomstring');
const request = require('request');
const testConfig = require('test/config');

/* eslint no-console: 0 no-unused-vars: 0 */
/* eslint-disable no-undef */
class TestConfigurator {

    constructor() {
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
        this.testReformProxy = testConfig.TestReformProxy;
        this.testInjectFormDataURL = testConfig.TestInjectFormDataURL;
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
                }, function (error, response, body) {
                    if (response.statusCode !== 201) {
                        throw new Error('TestConfigurator.getBefore: Using proxy - Unable to create user.  Response from IDAM was: ' + response.statusCode);
                    }
                });
            } else {
                request({
                    url: this.getTestAddUserURL(),
                    method: 'POST',
                    json: true, // <--Very important!!!
                    body: this.userDetails
                }, function (error, response, body) {
                    if (response.statusCode !== 201) {
                        throw new Error('TestConfigurator.getBefore: Without proxy - Unable to create user.  Response from IDAM was: ' + response.statusCode);
                    }
                });
            }
        }

    }

    getAfter() {
        // if (this.useIdam === 'true') {
        //     request({
        //             url: this.getTestDeleteUserURL() + process.env.testCitizenEmail,
        //             method: 'DELETE'
        //         }
        //     );

        //     this.resetEnvVars();
        // }
    }

    setTestCitizenName() {
        this.testCitizenName = randomstring.generate({
            length: 36,
            charset: 'alphabetic'
        }).toLowerCase();
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

    createFeeInfoTable() {
        const copiesAndEstateInfo = new DataTable(['noUKCopies', 'noOverseasCopies', 'grossValue', 'netValue']);
        copiesAndEstateInfo.add(['0', '0', '500', '400']); //No payment
        copiesAndEstateInfo.add(['0', '1', '500', '400']); //1 Overseas Copy
        copiesAndEstateInfo.add(['1', '0', '500', '400']); //1 UK Copy
        copiesAndEstateInfo.add(['2', '2', '7000', '6000']); //2 copies each and application fee
        return copiesAndEstateInfo;
    }

    createFeeInfoTableFor1Copy() {
        const copiesAndEstateInfo = new DataTable(['noUKCopies', 'noOverseasCopies', 'grossValue', 'netValue']);
        copiesAndEstateInfo.add(['0', '1', '500', '400']); //1 Overseas Copy
        copiesAndEstateInfo.add(['1', '0', '500', '400']); //1 UK Copy
        return copiesAndEstateInfo;
    }

    injectFormData(data, emailId) {
        const formData =
            {
                id: emailId,
                formdata: {
                    payloadVersion: '4.1.1',
                    applicantEmail: emailId,
                }
            };
        Object.assign(formData.formdata, data);
        request({
            url: this.testInjectFormDataURL,
            method: 'POST',
            headers: {'content-type': 'application/json', 'Session-Id': emailId},
            proxy: this.testReformProxy,
            socksProxyHost: 'localhost',
            socksProxyPort: '9090',
            json: true,
            body: formData
        },
        function (error, response, body) {
            console.log('This is email id ' + emailId);
        });
    }
}

module.exports = TestConfigurator;
