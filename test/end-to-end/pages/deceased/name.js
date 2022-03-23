'use strict';

module.exports = async function(language ='en', firstName = null, lastName = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/deceased-name');
    const firstNameLocator = {css: '#firstName'};
    await I.waitForEnabled(firstNameLocator);
    await I.fillField(firstNameLocator, firstName);
    await I.fillField({css: '#lastName'}, lastName);

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
