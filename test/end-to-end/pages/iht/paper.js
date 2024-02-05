'use strict';

const config = require('config');
module.exports = async function(language ='en', formName = null) {
    const commonContent = require(`app/resources/${language}/translation/common`);
    const I = this;
    let option;

    switch (formName) {
    case '205':
        option = '';
        break;
    case '400':
        option = '-2';
        break;
    case '421':
        option = '-3';
        break;
    default:
        option = '';
    }

    await I.checkInUrl('/estate-form');
    const locator = {css: `#ihtFormId${option}`};
    await I.waitForEnabled(locator, config.TestWaitForElementToAppear);
    await I.click(locator);

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
