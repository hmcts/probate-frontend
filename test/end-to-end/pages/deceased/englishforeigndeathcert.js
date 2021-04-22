'use strict';

const config = require('config');
const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const englishForeignDeathCertContentEn = require('app/resources/en/translation/deceased/englishforeigndeathcert');
const englishForeignDeathCertContentCy = require('app/resources/cy/translation/deceased/englishforeigndeathcert');

module.exports = async function(language = 'en', answer) {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const englishForeignDeathCertContent = language === 'en' ? englishForeignDeathCertContentEn : englishForeignDeathCertContentCy;

    await I.checkPageUrl('app/steps/ui/deceased/englishforeigndeathcert');
    await I.waitForText(englishForeignDeathCertContent.question, config.TestWaitForTextToAppear);

    const locator = `#englishForeignDeathCert${answer}`;
    await I.waitForElement(locator);
    await I.click(locator);
    await I.navByClick(commonContent.saveAndContinue);
};
