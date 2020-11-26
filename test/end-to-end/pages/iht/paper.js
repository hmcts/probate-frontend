'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(formName, grossAmount, netAmount) {
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

    const locator = {css: `#form${option}`};
    await I.waitForElement(locator);
    await I.click(locator);

    await I.fillField({css: `#grossValueFieldIHT${formName}`}, grossAmount);
    await I.fillField({css: `#netValueFieldIHT${formName}`}, netAmount);

    await I.navByClick(commonContent.saveAndContinue);
};
