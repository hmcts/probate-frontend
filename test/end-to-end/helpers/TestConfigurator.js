const randomstring = require('randomstring');
const request = require('request');
const testConfig = require('test/config.js');

class TestConfigurator {

    constructor() {
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
        this.TestFrontendUrl = testConfig.TestFrontendUrl;
        this.useGovPay = testConfig.TestUseGovPay;
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

            request({
                url: this.getTestAddUserURL(),
                method: 'POST',
                json: true, // <--Very important!!!
                body: userDetails,
                proxy: this.getIdamProxy(),
                rejectUnauthorized: this.getRejectUnauthorized(),
            });
        }
    }

    getAfter() {
        if (this.useIdam === 'true') {
            request({
                url: this.getTestDeleteUserURL() + process.env.testCitizenEmail,
                method: 'DELETE',
                proxy: this.getIdamProxy(),
                rejectUnauthorized: this.getRejectUnauthorized(),

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
