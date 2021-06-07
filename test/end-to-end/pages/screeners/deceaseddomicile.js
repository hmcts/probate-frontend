'use strict';

module.exports = async function(language ='en') {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const deceasedDomicileContent = require(`app/resources/${language}/translation/screeners/deceaseddomicile`);

    await I.waitForText(deceasedDomicileContent.question);
    await I.checkInUrl('/deceased-domicile');
    await I.see(deceasedDomicileContent.hintText1);
    const locator = {css: '#domicile'};
    await I.waitForEnabled(locator);

    await I.click(locator);
    await I.navByClick(commonContent.continue, 'button.govuk-button');
};
