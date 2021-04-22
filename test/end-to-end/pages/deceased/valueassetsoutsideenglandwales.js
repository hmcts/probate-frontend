'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');

module.exports = async function(language = 'en', netAmount) {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;

    await I.checkPageUrl('app/steps/ui/iht/valueassetsoutside');
    const locator = {css: '#netValueAssetsOutsideField'};
    await I.waitForElement(locator);
    await I.fillField(locator, netAmount);

    await I.navByClick(commonContent.saveAndContinue);
};
