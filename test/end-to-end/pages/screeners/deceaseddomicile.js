'use strict';

module.exports = async function(language ='en') {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const deceasedDomicileContent = require(`app/resources/${language}/translation/screeners/deceaseddomicile`);
    const {decodeHTML} = require('test/end-to-end/helpers/GeneralHelpers');
    await I.waitForText(await decodeHTML(deceasedDomicileContent.question));
    await I.checkInUrl('/deceased-domicile');
    const locator = {css: '#domicile'};
    await I.waitForEnabled(locator);

    await I.click(locator);
    await I.navByClick(commonContent.continue, 'button.govuk-button');
};
