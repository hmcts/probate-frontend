'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');

module.exports = async function(language ='en', answer, testSurvey = false) {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    await I.checkPageUrl('app/steps/ui/screeners/deathcertificate');
    await I.waitForText(commonContent.yes);

    if (testSurvey) {
        await I.click({css: 'body > div.govuk-width-container > div > p > span > a:nth-child(1)'});
        await I.switchToNextTab(1);
        // running locally I get no internet here so have commented ths, but at least we've proved we've opened a new tab.
        // await I.waitForVisible({css: '#cmdGo'});
        await I.closeCurrentTab();
    }

    await I.retry(2).click(commonContent.yes);
    await I.navByClick(commonContent.continue);
};
