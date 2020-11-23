'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(answer, testSurvey = false) {
    const I = this;

    const locator = {css: `#deathCertificate${answer}`};
    await I.seeElement(locator);

    if (testSurvey) {
        await I.click({css: 'body > div.govuk-width-container > div > p > span > a:nth-child(1)'});
        await I.switchToNextTab(1);
        await I.waitForVisible({css: '#cmdGo'});
        await I.closeCurrentTab();
    }

    await I.click(locator);

    await I.navByClick(commonContent.continue);
};
