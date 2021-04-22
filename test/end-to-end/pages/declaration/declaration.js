'use strict';

const config = require('config');
const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const contentEn = require('app/resources/en/translation/declaration');
const contentCy = require('app/resources/cy/translation/declaration');

module.exports = async function(language = 'en', bilingualGOP) {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const declarationContent = language === 'en' ? contentEn : contentCy;

    await I.checkPageUrl('app/steps/ui/declaration');
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
    await I.click({css: '#declarationCheckbox'});
    await I.navByClick(commonContent.saveAndContinue);
};
