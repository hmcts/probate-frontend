'use strict';

const config = require('config');

module.exports = async function(language = 'en', bilingualGOP = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const declarationContent = require(`app/resources/${language}/translation/declaration`);

    await I.checkInUrl('/declaration');
    if (language === 'en') {
        // The below check should be enabled for both English and Welsh once
        // this AAT Welsh content bug is fixed: https://tools.hmcts.net/jira/browse/DTSPB-1250
        // (raised 19/01/2020)
        await I.waitForText(declarationContent.highCourtHeader, config.TestWaitForTextToAppear);
    }

    const enLocator = {css: '#declarationPdfHref-en'};
    await I.waitForElement(enLocator);

    if (bilingualGOP) {
        await I.downloadPdfIfNotIE11({css: '#declarationPdfHref-cy'});
    }

    await I.downloadPdfIfNotIE11(enLocator);
    await I.waitForElement({css: '#declarationCheckbox'});
    await I.scrollTo({css: '#declarationCheckbox'});
    await I.click({css: '#declarationCheckbox'});
    await I.navByClick(commonContent.saveAndContinue);
};
