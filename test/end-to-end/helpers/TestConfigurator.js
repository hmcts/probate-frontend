const randomstring = require('randomstring');
const request = require('request');
const testConfig = require('test/config.js');

/* eslint no-console: 0 no-unused-vars: 0 */
class TestConfigurator {

    constructor() {
        console.log('IdamBaseUrl>>>', testConfig.TestIdamBaseUrl);
        this.testBaseUrl = testConfig.TestIdamBaseUrl;
        this.useIdam = testConfig.TestUseIdam;
        this.idamProxy = testConfig.TestIdamProxy;
        this.rejectUnauthorized = testConfig.TestRejectUnauthorized;
        this.setTestCitizenName();
        this.testCitizenDomain = testConfig.TestCitizenDomain.replace('/@', '@');
        this.testCitizenPassword = randomstring.generate(9);
        this.testAddUserUrl = testConfig.TestIdamAddUserUrl;
        this.testDeleteUserUrl = this.testAddUserUrl + '/';
        this.role = testConfig.TestIdamRole;
        this.testIdamUserGroup = testConfig.TestIdamUserGroup;
        this.paymentEnvironments = testConfig.paymentEnvironments;
        console.log('here2');
        this.TestFrontendUrl = testConfig.TestFrontendUrl;
        this.useGovPay = testConfig.TestUseGovPay;
        console.log('IdamBaseUrl222>>>', testConfig.TestIdamBaseUrl);
        console.log('testConfig>>>', testConfig);
    }

    getBefore() {
        if (this.useIdam === 'true') {
            this.setEnvVars();

            const userDetails =
                {
                    'email': this.getTestCitizenEmail(),
                    'forename': this.getTestCitizenName(),
                    'surname': this.getTestCitizenName(),
                    'password': this.getTestCitizenPassword(),
                    'roles': [{'code': this.getTestRole()}],
                    'userGroup': {'code': this.getTestIdamUserGroup()}
                };

            console.log('url>>>>', this.getTestAddUserURL().toString());

            request({
                url: this.getTestAddUserURL(),
                method: 'POST',
                json: true, // <--Very important!!!
                body: userDetails},
                function (error, response, body) {
                    // Do more stuff with 'body' here
                    console.log('error>>>', error);
                    console.log('response>>>', response);
                    console.log('body>>>', body);

  //              proxy: this.getIdamProxy(),
   //             rejectUnauthorized: this.getRejectUnauthorized(),
   //             requestCert: true
            });
        }
    }

    getAfter() {
        if (this.useIdam === 'true') {
            request({
                url: this.getTestDeleteUserURL() + process.env.testCitizenEmail,
                method: 'DELETE'
                //,
                //proxy: this.getIdamProxy(),
                //rejectUnauthorized: this.getRejectUnauthorized()
                }
            );

            this.resetEnvVars();
        }
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
        console.log('getTestAddUserURL>>>', this.testBaseUrl + this.testAddUserUrl);
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

    getIdamProxy() {
        return this.idamProxy;
    }

    getRejectUnauthorized() {
        return this.rejectUnauthorized;
    }
}

module.exports = TestConfigurator;
