'use strict';

module.exports = async function(language = 'en', option = null, year = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/will-damage-date');
    const locator = {css: `#willDamageDateKnown${option}`};
    await I.waitForEnabled(locator);
    await I.click(locator);

    if (option === '') {
        await I.fillField({css: '#willdamagedate-year'}, year);
    }

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
