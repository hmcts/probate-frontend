'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');

module.exports = async function(language = 'en', grossValue, netValue) {
    const I = this;
    const locatorGv = {css: '#grossValueField'};
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;

    await I.checkPageUrl('app/steps/ui/iht/value');
    await I.waitForElement (locatorGv);
    await I.fillField(locatorGv, grossValue);
    await I.fillField({css: '#netValueField'}, netValue);

    await I.navByClick(commonContent.saveAndContinue);
};
