'use strict';

module.exports = async function(language ='en', testSurvey = false) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const deathCertContent = require(`app/resources/${language}/translation/screeners/deathcertificate`);
    await I.checkInUrl('/death-certificate');
    await I.waitForText(deathCertContent.question);
    const locator = {css: '#deathCertificate'};
    await I.waitForEnabled(locator);

    if (testSurvey) {
        await I.click({css: 'body > div.govuk-width-container > div > p > span > a:nth-child(1)'});
        await I.switchToNextTab(1);
        // running locally I get no internet here so have commented ths, but at least we've proved we've opened a new tab.
        // await I.waitForVisible({css: '#cmdGo'});
        await I.closeCurrentTab();
    }
    await I.click(locator);
    await I.navByClick(commonContent.continue, 'button.govuk-button');
};
