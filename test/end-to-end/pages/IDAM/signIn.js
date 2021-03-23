'use strict';

const testConfig = require('config');
const useIdam = testConfig.TestUseIdam;

module.exports = async function (language ='en', noScreenerQuestions = false) {
    if (useIdam === 'true') {
        const I = this;
        if (noScreenerQuestions) {
            await I.amOnLoadedPage('/', language);
        }

        // const signInOrProbatePageLocator = {xpath: '[@name="loginForm" or @id="main-content"]'};
        // await I.waitForElement(signInOrProbatePageLocator, testConfig.TestWaitForTextToAppear);
        const locator = {css: 'a[href="/sign-out"]'};
        const numEls = await I.grabNumberOfVisibleElements(locator);
        if (numEls > 0) {
            await I.navByClick(locator);
            await I.seeSignOut(language);
        }
        await I.fillField({css: '#username'}, process.env.testCitizenEmail);
        await I.fillField({css: '#password'}, process.env.testCitizenPassword);
        await I.navByClick('//input[@class=\'button\' and @type=\'submit\']');
    }
};
