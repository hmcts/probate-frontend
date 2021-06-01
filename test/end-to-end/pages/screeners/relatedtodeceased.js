'use strict';

const contentEn = require('app/resources/en/translation/common');
const contentCy = require('app/resources/cy/translation/common');
const relationshipContentEn = require('app/resources/en/translation/screeners/relatedtodeceased');
const relationshipContentCy = require('app/resources/cy/translation/screeners/relatedtodeceased');

module.exports = async function(language ='en', answer) {
    const I = this;
    const commonContent = language === 'en' ? contentEn : contentCy;
    await I.amOnLoadedPage('app/steps/ui/screeners/relatedtodeceased', language);
    if (language === 'en') {
        await I.waitForText(relationshipContentEn.question);
        await I.waitForText(relationshipContentEn.hintText1);
        await I.waitForText(relationshipContentEn.optionYes);
    } else {
        await I.waitForText(relationshipContentCy.question);
        await I.waitForText(relationshipContentCy.hintText1);
        await I.waitForText(relationshipContentCy.optionYes);
    }

    const locator = {css: `#related${answer}`};
    await I.click(locator);
    await I.navByClick(commonContent.continue);
};
