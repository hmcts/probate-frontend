'use strict';

module.exports = async function(language = 'en', grossValue = null, netValue = null) {
    const I = this;
    const locatorGv = {css: '#grossValueField'};
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/iht-value');
    await I.waitForElement (locatorGv);
    await I.fillField(locatorGv, grossValue);
    await I.fillField({css: '#netValueField'}, netValue);

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
