'use strict';

module.exports = async function(language ='en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/new-submitted-to-hmrc');
    await I.waitForEnabled(`#ihtFormEstateId${answer}`);
    await I.click(`#ihtFormEstateId${answer}`);
    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');

};
