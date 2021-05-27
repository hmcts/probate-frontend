'use strict';

const testConfig = require('config');

module.exports = async function(language = 'en') {
    const I = this;
    const signOutContent = require(`app/resources/${language}/translation/signout`);

    await I.checkInUrl('/sign-out');
    await I.waitForText(signOutContent.header, testConfig.TestWaitForTextToAppear);
    const locator = {css: '#main-content > div > div > p:nth-child(3) > a'};
    await I.waitForElement(locator);
    await I.navByClick(locator);
};
