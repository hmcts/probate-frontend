'use strict';

const config = require('config');
module.exports = async function(language = 'en', option = null, reason = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/will-damage-reason');
    const locator = {css: `#willDamageReasonKnown${option}`};
    await I.waitForEnabled({css: `#willDamageReasonKnown${option}`}, config.TestWaitForElementToAppear);
    await I.click(locator);

    if (option === '') {
        await I.fillField({css: '#willDamageReasonDescription'}, reason);
    }

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
