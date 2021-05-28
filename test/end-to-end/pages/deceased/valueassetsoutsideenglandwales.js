'use strict';

module.exports = async function(language = 'en', netAmount = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/value-assets-outside-england-wales');
    const locator = {css: '#netValueAssetsOutsideField'};
    await I.waitForEnabled(locator);
    await I.fillField(locator, netAmount);

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
