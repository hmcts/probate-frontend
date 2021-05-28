'use strict';

module.exports = async function(language ='en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/certificate-interim');
    await I.waitForEnabled(`#deathCertificate${answer}`);
    await I.click(`#deathCertificate${answer}`);
    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');

};
