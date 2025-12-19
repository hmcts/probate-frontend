'use strict';

module.exports = async function(language ='en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/deceased-late-spouse-civil-partner');
    await I.waitForEnabled(`#deceasedHadLateSpouseOrCivilPartner${answer}`);
    await I.click(`#deceasedHadLateSpouseOrCivilPartner${answer}`);
    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');

};
