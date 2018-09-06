const testConfig = require('test/config.js');

const useIdam = testConfig.TestUseIdam;

module.exports = function (credentials) {
    if (useIdam === 'true') {
        const I = this;

        I.see('Sign in');

        if (credentials) {
            I.fillField('username', credentials[0]);
            I.fillField('password', credentials[1]);
        } else {
            I.fillField('username', process.env.testCitizenEmail);
            I.fillField('password', process.env.testCitizenPassword);
        }

        I.click('Sign in');
    }

    return [process.env.testCitizenEmail, process.env.testCitizenPassword];
};
