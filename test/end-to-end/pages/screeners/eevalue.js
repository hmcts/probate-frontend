'use strict';

module.exports = async function(language = 'en') {
    const I = this;
    const eeestatevalued = require(`app/resources/${language}/translation/screeners/eeestatevalued`);
    const commonContent = require(`app/resources/${language}/translation/common`);
    await I.checkInUrl('/ee-estate-valued');
    await I.waitForText(eeestatevalued.question);

    const locator = {css: '#eeEstateValued'};
    await I.waitForEnabled(locator);
    await I.click(locator);
    await I.navByClick(commonContent.continue, 'button.govuk-button');
};
