'use strict';

const ihtDataConfig = require('test/end-to-end/pages/ee/ihtData');
const optionYes = ihtDataConfig.optionYes;
const optionNo = ihtDataConfig.optionNo;

module.exports = async function(language = 'en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    const locator = {css: `#bilingual${answer}`};
    const otherAnswer = answer === optionYes ? optionNo : optionYes;
    const otherLocator = {css: `#bilingual${otherAnswer}`};

    await I.checkInUrl('/bilingual-gop');
    await I.waitForEnabled(locator);
    await I.dontSeeCheckboxIsChecked(locator);
    await I.dontSeeCheckboxIsChecked(otherLocator);
    await I.click(locator);
    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
