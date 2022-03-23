'use strict';

const config = require('config');

module.exports = async function (language = 'en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const childrenContent = language === 'en' ? 'have any other children?' : 'blant eraill?';

    await I.checkInUrl('/any-other-children');
    await I.waitForText(childrenContent, config.TestWaitForTextToAppear);
    const locator = {css: `#anyOtherChildren${answer}`};
    await I.waitForEnabled(locator);
    await I.click(locator);

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
