'use strict';

module.exports = async function(language = 'en') {
    const I = this;
    const {decodeHTML} = require('test/end-to-end/helpers/GeneralHelpers');
    const eeEstateValuedContent = require(`app/resources/${language}/translation/screeners/eeestatevalued`);
    const commonContent = require(`app/resources/${language}/translation/common`);
    await I.checkInUrl('/ee-estate-valued');

    const locator = {css: '#eeEstateValued'};

    await I.see(await decodeHTML(eeEstateValuedContent.question));
    await I.waitForText(await decodeHTML(eeEstateValuedContent.question));
    await I.waitForEnabled(locator);
    await I.click(locator);
    await I.navByClick(commonContent.continue, 'button.govuk-button');
};
