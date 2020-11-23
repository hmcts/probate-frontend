'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(bilingualGOP) {
    const I = this;

    const enLocator = {css: '#declarationPdfHref-en'};

    await I.waitForElement(enLocator);

    if (bilingualGOP) {
        await I.downloadPdfIfNotIE11({css: '#declarationPdfHref-cy'});
    }

    await I.downloadPdfIfNotIE11(enLocator);
    await I.click({css: '#declarationCheckbox'});

    await I.navByClick(commonContent.saveAndContinue);
};
