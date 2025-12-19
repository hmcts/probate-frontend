'use strict';

module.exports = async function(language = 'en', option = null, description = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/codicils-have-damage');
    const locator = {css: `#codicilsHasVisibleDamage${option}`};
    await I.waitForEnabled(locator);
    await I.click(locator);
    if (option === '') {
        await I.click('#codicilsDamageTypes');
        await I.click('#codicilsDamageTypes-2');
        await I.click('#codicilsDamageTypes-3');
        await I.click('#codicilsDamageTypes-4');
        await I.click('#codicilsDamageTypes-5');
        await I.click('#codicilsDamageTypes-6');

        await I.fillField({css: '#otherDamageDescription'}, description);
    }

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
