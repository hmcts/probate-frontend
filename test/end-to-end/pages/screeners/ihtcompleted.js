'use strict';

const contentEn = require('app/resources/en/translation/common');
const contentCy = require('app/resources/cy/translation/common');
const ihtCompletedEn = require('app/resources/en/translation/screeners/ihtcompleted');
const ihtCompletedCy = require('app/resources/cy/translation/screeners/ihtcompleted');

module.exports = async function(language ='en', answer) {
    const I = this;
    const commonContent = language === 'en' ? contentEn : contentCy;
    const ihtCompletedContent = language === 'en' ? ihtCompletedEn : ihtCompletedCy;

    await I.checkPageUrl('app/steps/ui/screeners/ihtcompleted');
    await I.waitForText(ihtCompletedContent.question);
    const locator = {css: `#completed${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);

    await I.navByClick(commonContent.continue);
};
