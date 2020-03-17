'use strict';

const testConfig = require('test/config.js');
const useIdam = testConfig.TestUseIdam;

module.exports = function (noScreenerQuestions = false) {
    if (useIdam === 'true') {
        const I = this;

        if (noScreenerQuestions) {
            I.amOnPage('/');
        }

        I.waitForText('Sign in', testConfig.TestWaitForTextToAppear);
        I.fillField('username', process.env.testCitizenEmail);
        I.fillField('password', process.env.testCitizenPassword);

        I.click('Sign in');
    }
};
