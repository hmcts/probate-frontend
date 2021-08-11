'use strict';

module.exports = async function(language ='en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const willOriginalContent = require(`app/resources/${language}/translation/screeners/willoriginal`);

    await I.checkInUrl('/will-original');
    await I.waitForText(willOriginalContent.question);

    const locator = {css: `#original${answer}`};
    await I.waitForEnabled(locator);
    await I.click(locator);
    await I.navByClick(commonContent.continue, 'button.govuk-button');
};
