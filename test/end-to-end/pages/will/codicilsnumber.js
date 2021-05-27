'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(totalCodicils) {
    const I = this;

    await I.checkInUrl('/codicils-number');
    await I.waitForVisible({css: '#codicilsNumber'});
    await I.fillField({css: '#codicilsNumber'}, totalCodicils);

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
