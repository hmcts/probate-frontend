'use strict';

module.exports = async function(language = 'en') {
    const I = this;
    const eedeceaseddod = require(`app/resources/${language}/translation/screeners/eedeceaseddod`);
    const commonContent = require(`app/resources/${language}/translation/common`);
    await I.checkInUrl('/ee-deceased-dod');
    await I.waitForText(eedeceaseddod.question);

    const locator = {css: '#eeDeceasedDod'};
    await I.waitForEnabled(locator);
    await I.click(locator);
    await I.navByClick(commonContent.continue, 'button.govuk-button');
};
