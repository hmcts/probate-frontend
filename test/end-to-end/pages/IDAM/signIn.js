'use strict';

const testConfig = require('config');
const useIdam = testConfig.TestUseIdam;

module.exports = async function (noScreenerQuestions = false) {
    if (useIdam === 'true') {
        const I = this;

        if (noScreenerQuestions) {
            await I.amOnLoadedPage('/');
        }

        const signInOrProbatePageLocator = {xpath: '//*[@name="loginForm" or @id="main-content"]'};
        await I.waitForElement(signInOrProbatePageLocator, testConfig.TestWaitForTextToAppear);
        const locator = {css: 'a[href="/sign-out"]'};
        const numEls = await I.grabNumberOfVisibleElements(locator);
        if (numEls > 0) {
            await I.navByClick(locator);
            await I.seeSignOut();
        }

        await I.waitForText('Sign in', testConfig.TestWaitForTextToAppear, 'h1');
        await I.fillField('username', process.env.testCitizenEmail);
        await I.fillField('password', process.env.testCitizenPassword);

        await I.navByClick({css: 'input.button[value="Sign in"]'});
    }
};
