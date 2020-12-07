'use strict';

const config = require('config');
const commonContent = require('app/resources/en/translation/common');
const content = require('app/resources/en/translation/declaration');

module.exports = async function(bilingualGOP) {
    const I = this;

    await I.checkPageUrl('app/steps/ui/declaration');
    await I.waitForText(content.highCourtHeader, config.TestWaitForTextToAppear);
    const enLocator = {css: '#declarationPdfHref-en'};
    await I.waitForElement(enLocator);

    if (bilingualGOP) {
        await I.downloadPdfIfNotIE11({css: '#declarationPdfHref-cy'});
    }

    await I.downloadPdfIfNotIE11(enLocator);
    await I.click({css: '#declarationCheckbox'});

    await I.navByClick(commonContent.saveAndContinue);
};
