'use strict';

module.exports = async function(language = 'en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/died-eng-or-wales');
    const locator = {css: `#diedEngOrWales${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);
    await I.navByClick(commonContent.saveAndContinue);
};
