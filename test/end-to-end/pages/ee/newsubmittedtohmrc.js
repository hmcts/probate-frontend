'use strict';

module.exports = async function(language ='en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/new-submitted-to-hmrc');
    await I.waitForEnabled(`#estateValueCompleted${answer}`);
    await I.click(`#estateValueCompleted${answer}`);
    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');

};
