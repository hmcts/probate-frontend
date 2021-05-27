'use strict';

module.exports = async function(language = 'en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/deceased-marital-status');
    const locator = {css: `#maritalStatus${answer}`};

    await I.waitForClickable(locator);
    await I.click(locator);
    await I.navByClick(commonContent.saveAndContinue);
};
