module.exports = async function(language = 'en', option = null, year = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/codicils-damage-date');
    const locator = {css: `#codicilsDamageDateKnown${option}`};
    await I.waitForEnabled(locator);
    await I.click(locator);
    if (option === '') {
        await I.fillField({css: '#codicilsdamagedate-year'}, year);
    }

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
