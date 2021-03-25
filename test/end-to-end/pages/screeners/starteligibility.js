'use strict';
/* eslint no-console: 0 no-unused-vars: 0 */
/* eslint-disable no-undef */
const config = require('config');
const contentEn = require('app/resources/en/translation/common');
const contentCy = require('app/resources/cy/translation/common');

module.exports = async function(language='en', checkCookieBannerExists = false) {
    const I = this;
    const commonContent = language === 'en' ? contentEn : contentCy;
    await I.amOnLoadedPage('/start-eligibility', language);

    if (checkCookieBannerExists) {
        await I.waitForElement('div#global-cookie-message', config.TestWaitForElementToAppear);
    }
    const locator = {css: '#start-apply-button'};
    await I.waitForElement(locator, config.TestWaitForElementToAppear);
    await I.navByClick(commonContent.checkApply);
};
