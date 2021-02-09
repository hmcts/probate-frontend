'use strict';

const contentEn = require('app/resources/en/translation/common');
const contentCy = require('app/resources/cy/translation/common');

// eslint-disable-next-line no-unused-vars
module.exports = async function(language = 'en', answer) {
    const I = this;
    const commonContent = language === 'en' ? contentEn : contentCy;

    await I.checkPageUrl('app/steps/ui/language');
    const locator = {css: '#bilingual-2'};
    await I.waitForEnabled(locator);
    await I.seeCheckboxIsChecked(locator);
    await I.navByClick(commonContent.saveAndContinue);
};
