'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(grossValue, netValue) {
    const I = this;
    const locatorGv = {css: '#grossValueField'};

    await I.checkPageUrl('app/steps/ui/iht/value');
    await I.waitForElement (locatorGv);
    await I.fillField(locatorGv, grossValue);
    await I.fillField({css: '#netValueField'}, netValue);

    await I.navByClick(commonContent.saveAndContinue);
};
