'use strict';

module.exports = async function(language = 'en', option = null, description = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/codicils-damage-reason');
    const locator = {css: `#codicilsDamageReasonKnown${option}`};
    await I.waitForEnabled(locator);
    await I.click(locator);
    if (option === '') {
        await I.fillField({css: '#codicilsDamageReasonDescription'}, description);
    }

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
