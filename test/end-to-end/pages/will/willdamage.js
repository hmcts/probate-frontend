'use strict';

module.exports = async function(language = 'en', option = null, description = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/will-has-damage');
    const locator = {css: `#willHasVisibleDamage${option}`};
    await I.waitForEnabled(locator);
    await I.click(locator);
    if (option === '') {
        await I.click('#willDamageTypes');
        await I.click('#willDamageTypes-2');
        await I.click('#willDamageTypes-3');
        await I.click('#willDamageTypes-4');
        await I.click('#willDamageTypes-5');
        await I.click('#willDamageTypes-6');

        await I.fillField({css: '#otherDamageDescription'}, description);
    }

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
