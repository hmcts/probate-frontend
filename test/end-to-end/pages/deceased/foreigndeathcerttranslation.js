'use strict';

const config = require('config');
const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const contentEn = require('app/resources/en/translation/deceased/foreigndeathcerttranslation');
const contentCy = require('app/resources/cy/translation/deceased/foreigndeathcerttranslation');

module.exports = async function(language = 'en', answer) {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const foreignDeathCertTranslationContent = language === 'en' ? contentEn : contentCy;

    await I.checkPageUrl('app/steps/ui/deceased/foreigndeathcerttranslation');
    await I.waitForText(foreignDeathCertTranslationContent.question, config.TestWaitForTextToAppear);

    const locator = {css: `#foreignDeathCertTranslation${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);

    await I.navByClick(commonContent.saveAndContinue);
};
