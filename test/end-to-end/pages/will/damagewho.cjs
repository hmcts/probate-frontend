'use strict';

module.exports = async function(language = 'en', option = null, firstName = null, lastName = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/will-damage-who');
    const locator = {css: `#willDamageCulpritKnown${option}`};
    await I.waitForEnabled(locator);
    await I.click(locator);

    if (option === '') {
        await I.fillField({css: '#firstName'}, firstName);
        await I.fillField({css: '#lastName'}, lastName);
    }

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
