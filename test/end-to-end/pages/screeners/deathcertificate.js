'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(answer, testSurvey = false) {
    const I = this;

    const locator = {css: `#deathCertificate${answer}`};
    await I.waitForElement(locator, 20);
    await I.seeElement(locator);

    if (testSurvey) {
        await I.click({css: 'body > div.govuk-width-container > div > p > span > a:nth-child(1)'});
        await I.switchToNextTab(1);
        // running locally I get no internet here so have commented ths, but at least we've proved we've opened a new tab.
        // await I.waitForVisible({css: '#cmdGo'});
        await I.closeCurrentTab();
    }

    await I.click(locator);

    await I.navByClick(commonContent.continue);
};
