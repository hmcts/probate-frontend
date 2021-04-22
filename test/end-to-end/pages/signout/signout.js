'use strict';

const signOutContentEn = require('app/resources/en/translation/signout');
const signOutContentCy = require('app/resources/cy/translation/signout');
const testConfig = require('config');

module.exports = async function(language = 'en') {
    const I = this;
    const signOutContent = language === 'en' ? signOutContentEn : signOutContentCy;

    await I.checkPageUrl('app/steps/ui/signout');
    await I.waitForText(signOutContent.header, testConfig.TestWaitForTextToAppear);
    const locator = {css: '#main-content > div > div > p:nth-child(3) > a'};
    await I.waitForElement(locator);
    await I.navByClick(locator);
};
