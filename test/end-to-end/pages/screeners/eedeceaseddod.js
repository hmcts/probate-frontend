'use strict';

module.exports = async function(language = 'en') {
    const I = this;
    const eeDeceasedDodContent = require(`app/resources/${language}/translation/screeners/eedeceaseddod`);
    const commonContent = require(`app/resources/${language}/translation/common`);
    const {decodeHTML} = require('test/end-to-end/helpers/GeneralHelpers');
    await I.checkInUrl('/ee-deceased-dod');

    const locator = {css: '#eeDeceasedDod'};
    await I.see(await decodeHTML(eeDeceasedDodContent.question));
    await I.waitForText(await decodeHTML(eeDeceasedDodContent.question));
    await I.waitForEnabled(locator);
    await I.click(locator);
    await I.navByClick(commonContent.continue, 'button.govuk-button');
};
