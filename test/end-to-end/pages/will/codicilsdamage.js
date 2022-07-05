'use strict';

module.exports = async function(language = 'en', option = null, description = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/codicils-have-damage');
    const locator = {css: `#codicilsHasVisibleDamage${option}`};
    await I.waitForEnabled(locator);
    await I.click(locator);
    if (option === '') {
        await I.click('#codicilsDamage');
        await I.click('#codicilsDamage-2');
        await I.click('#codicilsDamage-3');
        await I.click('#codicilsDamage-4');
        await I.click('#codicilsDamage-5');
        await I.click('#codicilsDamage-6');

        await I.fillField({css: '#otherDamageDescription'}, description);
    }

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
