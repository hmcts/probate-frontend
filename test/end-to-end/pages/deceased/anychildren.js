'use strict';

const config = require('config');

module.exports = async function (language = 'en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const childrenContent = require(`app/resources/${language}/translation/deceased/anychildren`);

    await I.checkInUrl('/any-children');
    await I.waitForText(childrenContent.hint, config.TestWaitForTextToAppear);
    const locator = `#anyChildren${answer}`;
    await I.waitForElement(locator);
    await I.click(locator);

    await I.navByClick(commonContent.saveAndContinue);
};
