'use strict';

module.exports = async function(language ='en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/hmrc-letter');
    await I.waitForEnabled(`#hmrcLetterId${answer}`);
    await I.click(`#hmrcLetterId${answer}`);
    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');

};
