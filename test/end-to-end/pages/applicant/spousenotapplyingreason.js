'use strict';

const config = require('config');

module.exports = async function (language = 'en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const spouseContent = require(`app/resources/${language}/translation/applicant/spousenotapplyingreason`);
    await I.checkInUrl('/spouse-not-applying-reason');
    await I.waitForText(spouseContent.optionRenouncing, config.TestWaitForTextToAppear);
    const locator = {css: `#spouseNotApplyingReason${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);
    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
