'use strict';

module.exports = async function(language ='en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/estate-form');
    await I.waitForEnabled(`#ihtFormEstateId${answer}`);
    await I.click(`#ihtFormEstateId${answer}`);
    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');

};
