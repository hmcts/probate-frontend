'use strict';

module.exports = async function(language ='en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const ihtCompletedContent = require(`app/resources/${language}/translation/screeners/ihtcompleted`);
    const {decodeHTML} = require('test/end-to-end/helpers/GeneralHelpers');
    await I.checkInUrl('/iht-completed');
    await I.waitForText(await decodeHTML(ihtCompletedContent.question));
    await I.see(ihtCompletedContent.hintText);
    const locator = {css: `#completed${answer}`};
    await I.waitForEnabled(locator);
    await I.click(locator);

    await I.navByClick(commonContent.continue, 'button.govuk-button');
};
