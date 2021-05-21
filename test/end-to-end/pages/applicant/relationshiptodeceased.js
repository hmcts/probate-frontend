'use strict';

const config = require('config');
const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const relationshipContentEn = require('app/resources/en/translation/applicant/relationshiptodeceased');
const relationshipContentCy = require('app/resources/cy/translation/applicant/relationshiptodeceased');

module.exports = async function(language = 'en', answer) {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const relationshipContent = language === 'en' ? relationshipContentEn : relationshipContentCy;

    await I.checkPageUrl('app/steps/ui/applicant/relationshiptodeceased');
    await I.waitForText(relationshipContent.title, config.TestWaitForTextToAppear);
    await I.waitForText(relationshipContent.question);
    await I.wait(2);
    const locator = {css: `#relationshipToDeceased${answer}`};
    await I.click(locator);

    await I.navByClick(commonContent.saveAndContinue);
};
