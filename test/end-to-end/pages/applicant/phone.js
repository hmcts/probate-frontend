'use strict';

const config = require('config');

module.exports = async function(language = 'en') {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const phoneContent = require(`app/resources/${language}/translation/applicant/phone`);

    await I.checkInUrl('/applicant-phone');
    await I.waitForText(phoneContent.phoneNumber, config.TestWaitForTextToAppear);
    const locator = {css: '#phoneNumber'};
    await I.waitForEnabled(locator);
    await I.fillField(locator, '123456789');
    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
