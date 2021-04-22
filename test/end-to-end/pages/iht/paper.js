'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');

module.exports = async function(language ='en', formName, grossAmount, netAmount) {
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
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

    await I.checkPageUrl('app/steps/ui/iht/paper');
    const locator = {css: `#form${option}`};
    await I.waitForElement(locator);
    await I.click(locator);

    await I.fillField({css: `#grossValueFieldIHT${formName}`}, grossAmount);
    await I.fillField({css: `#netValueFieldIHT${formName}`}, netAmount);

    await I.navByClick(commonContent.saveAndContinue);
};
