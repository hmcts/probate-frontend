'use strict';

module.exports = async function(language = 'en', grossValue = null, netValue = null, netQualifyingValue = null) {
    const I = this;
    const locatorGv = {css: '#estateGrossValueField'};
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/iht-estate-values');
    await I.waitForEnabled (locatorGv);
    await I.fillField(locatorGv, grossValue);
    await I.fillField({css: '#estateNetValueField'}, netValue);
    await I.fillField({css: '#estateNetQualifyingValueField'}, netQualifyingValue);

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
