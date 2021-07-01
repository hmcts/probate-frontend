'use strict';

module.exports = async function(language = 'en') {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    await I.checkInUrl('/deceased-address');
    await I.enterAddress();
    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
