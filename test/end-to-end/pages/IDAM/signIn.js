'use strict';

const testConfig = require('config');
const useIdam = testConfig.TestUseIdam;

module.exports = async function (noScreenerQuestions = false) {
    if (useIdam === 'true') {
        const I = this;

        if (noScreenerQuestions) {
            await I.amOnPage('/');
        }

        await I.waitForText('Sign in', testConfig.TestWaitForTextToAppear);
        await I.fillField('username', process.env.testCitizenEmail);
        await I.fillField('password', process.env.testCitizenPassword);

        await I.navByClick('Sign in');
    }
};
