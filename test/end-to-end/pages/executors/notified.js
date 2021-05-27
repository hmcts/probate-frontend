'use strict';

module.exports = async function(language = 'en', executorNotified = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/executor-notified');
    const locator = {css: `#executorNotified${executorNotified}`};
    await I.waitForClickable(locator);
    await I.click(locator);
    await I.navByClick(commonContent.saveAndContinue);
};
