'use strict';

const randomstring = require('randomstring');
const request = require('request');
const testConfig = require('test/config');
const Service = require('app/services/Service');
const service = new Service();
const {URLSearchParams} = require('url');
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
        //this.testOAuth2TokenUrl = this.testBaseUrl + TestOAuth2TokenUrl;
    }

    getAuthorisationToken() {
        return request({
            url: 'https://idam-api.aat.platform.hmcts.net/oauth2/authorize?response_type=code&client_id=probate&redirect_uri=https://probate-frontend-aat.service.core-compute-aat.internal/oauth2/callback',
            proxy: this.getProxy(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ZW1iZXJsaS5yaWRsZXlAdXVsdXUub3JnOlByb2JhdGUxMjM='
            }
            //,
            //json: true, // <--Very important!!!
            //body: 'response_type=code&client_id=probate&redirect_uri=https://probate-frontend-aat.service.core-compute-aat.internal/oauth2/callback'
        }, function (error, response, body) {
            if (response && response.statusCode !== 200) {
                throw new Error('TestConfigurator.getBefore: Using proxy - Unable to create user.  Response from IDAM was: ' + response.statusCode);
            }
            console.log(body.code);
            return body.code;
        });
    }

    async getBefore() {
        console.log('here');
        //const authToken = yield this.getAuthorisationToken();
        const url = 'https://idam-api.aat.platform.hmcts.net/oauth2/authorize?response_type=code&client_id=probate&redirect_uri=https://probate-frontend-aat.service.core-compute-aat.internal/oauth2/callback';
        //this.log(logMessage);
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ZW1iZXJsaS5yaWRsZXlAdXVsdXUub3JnOlByb2JhdGUxMjM='
        };
        const fetchOptions = service.fetchOptions({}, 'POST', headers, 'socks5:proxyout.reform.hmcts.net:8080');
        const data = await service.fetchJson(url, fetchOptions);
        const authCode = data.code;

        const client_id = 'probate';
     //   const client_secret = config.services.idam.probate_oauth2_secret;
     //   const idam_api_url = config.services.idam.apiUrl;
     //   const redirect_uri = redirect_url;

        const headers2 = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', authCode);
        params.append('redirect_uri', 'https://probate-frontend-aat.service.core-compute-aat.internal/oauth2/callback');
        params.append('client_id', 'probate');
        params.append('client_secret', 'staSwA5Hu6as6upra8ew3upeq2drUbup');
        const test = (params.toString());
        const data2 = await service.fetchJson('https://idam-api.aat.platform.hmcts.net/oauth2/token', {
            method: 'POST',
            timeout: 10000,
            body: params.toString(),
            headers: headers2,
            proxy: 'socks5:proxyout.reform.hmcts.net:8080'
        });
        console.log('data2>>>>', data2);

        //.then(data => {
        // console.log('data>>>>', data);
        // });

    }

    // getBefore() {
    //     if (process.env.testCitizenEmail === this.getTestCitizenEmail()) {
    //         this.setTestCitizenName();
    //         this.setTestCitizenPassword();
    //     }
    //
    //     this.setEnvVars();
    //
    //     if (this.useIdam === 'true') {
    //         this.userDetails =
    //             {
    //                 'email': this.getTestCitizenEmail(),
    //                 'forename': this.getTestCitizenName(),
    //                 'surname': this.getTestCitizenName(),
    //                 'password': this.getTestCitizenPassword(),
    //                 'roles': [{'code': this.getTestRole()}],
    //                 'userGroup': {'code': this.getTestIdamUserGroup()}
    //             };
    //
    //         if (this.getUseProxy() === 'true') {
    //             console.log('use proxy');
    //             request({
    //                 url: this.getTestAddUserURL(),
    //                 proxy: this.getProxy(),
    //                 method: 'POST',
    //                 json: true, // <--Very important!!!
    //                 body: this.userDetails
    //             }, function (error, response, body) {
    //                 if (response && response.statusCode !== 201) {
    //                     throw new Error('TestConfigurator.getBefore: Using proxy - Unable to create user.  Response from IDAM was: ' + response.statusCode);
    //                 }
    //             });
    //         } else {
    //             console.log('no proxy');
    //             request({
    //                 url: this.getTestAddUserURL(),
    //                 method: 'POST',
    //                 json: true, // <--Very important!!!
    //                 body: this.userDetails
    //             }, function (error, response, body) {
    //                 if (response.statusCode !== 201) {
    //                     throw new Error('TestConfigurator.getBefore: Without proxy - Unable to create user.  Response from IDAM was: ' + response.statusCode);
    //                 }
    //             });
    //         }
    //     }
    //
    // }

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

    injectFormData(data, emailId) {
        const formData =
            {
                id: emailId,
                formdata: {
                    payloadVersion: '4.1.0',
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
        (error, response, body) => {
            console.log('This is email id ' + emailId);
        });
    }
}

module.exports = TestConfigurator;
