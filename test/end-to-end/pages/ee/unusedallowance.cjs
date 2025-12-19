'use strict';

module.exports = async function(language ='en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/unused-allowance-claimed');
    await I.waitForEnabled(`#unusedAllowanceClaimed${answer}`);
    await I.click(`#unusedAllowanceClaimed${answer}`);
    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');

};
