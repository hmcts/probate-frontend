'use strict';

const config = require('config');
const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const spouseContentEn = require('app/resources/en/translation/applicant/spousenotapplyingreason');
const spouseContentCy = require('app/resources/cy/translation/applicant/spousenotapplyingreason');

module.exports = async function (language = 'en', answer) {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const spouseContent = language === 'en' ? spouseContentEn : spouseContentCy;

    await I.checkPageUrl('app/steps/ui/applicant/spousenotapplyingreason');
    await I.waitForText(spouseContent.optionRenouncing, config.TestWaitForTextToAppear);
    const locator = {css: `#spouseNotApplyingReason${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);
    await I.navByClick(commonContent.saveAndContinue);
};
