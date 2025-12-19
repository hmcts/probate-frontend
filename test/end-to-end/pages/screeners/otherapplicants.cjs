'use strict';

module.exports = async function(language ='en', answer = null) {
    const I = this;
    const otherApplicantsContent = require(`app/resources/${language}/translation/screeners/otherapplicants`);
    const commonContent = require(`app/resources/${language}/translation/common`);
    const {decodeHTML} = require('test/end-to-end/helpers/GeneralHelpers');
    await I.checkInUrl('/other-applicants');
    await I.waitForText(await decodeHTML(otherApplicantsContent.question));

    const locator = {css: `#otherApplicants${answer}`};
    await I.waitForEnabled(locator);
    await I.click(locator);

    await I.navByClick(commonContent.continue, 'button.govuk-button');
};
