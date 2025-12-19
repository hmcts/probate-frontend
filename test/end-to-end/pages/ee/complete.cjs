'use strict';

module.exports = async function(language ='en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/calc-check');
    await I.waitForEnabled(`#calcCheckCompleted${answer}`);
    await I.click(`#calcCheckCompleted${answer}`);
    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');

};
