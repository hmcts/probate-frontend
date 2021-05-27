'use strict';

module.exports = async function(language ='en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const ihtCompletedContent = require(`app/resources/${language}/translation/screeners/ihtcompleted`);

    await I.checkInUrl('/iht-completed');
    await I.waitForText(ihtCompletedContent.question);
    const locator = {css: `#completed${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);

    await I.navByClick(commonContent.continue);
};
