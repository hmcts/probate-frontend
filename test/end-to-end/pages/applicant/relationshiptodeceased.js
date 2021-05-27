'use strict';

const config = require('config');

module.exports = async function(language = 'en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const relationshipContent = require(`app/resources/${language}/translation/applicant/relationshiptodeceased`);

    await I.checkInUrl('/relationship-to-deceased');
    await I.waitForText(relationshipContent.question, config.TestWaitForTextToAppear);
    const locator = {css: `#relationshipToDeceased${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
