'use strict';

module.exports = async function(language = 'en') {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/iht-identifier');
    const locator = {css: '#identifier'};

    await I.waitForEnabled(locator);
    await I.fillField(locator, '123456789XXXXX');
    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
