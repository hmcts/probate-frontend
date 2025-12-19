'use strict';

module.exports = async function(language ='en', firstName = null, lastName = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/deceased-alias-name-on-will');
    const firstNameLocator = {css: '#aliasFirstNameOnWill'};
    await I.waitForEnabled(firstNameLocator);
    await I.fillField(firstNameLocator, firstName);
    await I.fillField({css: '#aliasLastNameOnWill'}, lastName);

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
