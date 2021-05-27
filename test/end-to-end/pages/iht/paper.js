'use strict';

module.exports = async function(language ='en', formName = null, grossAmount = null, netAmount = null) {
    const commonContent = require(`app/resources/${language}/translation/common`);
    const I = this;
    let option;

    switch (formName) {
    case '207':
        option = '-2';
        break;
    case '421':
        option = '-3';
        break;
    default:
        option = '';
    }

    await I.checkInUrl('/iht-paper');
    const locator = {css: `#form${option}`};
    await I.waitForElement(locator);
    await I.click(locator);

    await I.fillField({css: `#grossValueFieldIHT${formName}`}, grossAmount);
    await I.fillField({css: `#netValueFieldIHT${formName}`}, netAmount);

    await I.navByClick(commonContent.saveAndContinue);
};
