'use strict';

module.exports = async function(language = 'en', option = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/codicils-have-damage');
    const locator = {css: `#codicilsHasVisibleDamage${option}`};
    await I.waitForEnabled(locator);
    await I.click(locator);

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
