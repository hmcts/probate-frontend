'use strict';

module.exports = async function(language ='en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/related-to-deceased');
    const locator = {css: `#related${answer}`};
    await I.waitForClickable(locator);
    await I.click(locator);

    await I.navByClick(commonContent.continue);
};
