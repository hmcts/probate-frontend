'use strict';

module.exports = async function(language = 'en', totalCodicils) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/codicils-number');
    await I.waitForVisible({css: '#codicilsNumber'});
    await I.fillField({css: '#codicilsNumber'}, totalCodicils);

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
