'use strict';

module.exports = async function(language ='en', testSurvey = false) {
    const I = this;
    const thankYouContent = require(`app/resources/${language}/translation/thankyou`);

    await I.checkInUrl('/thank-you');
    await I.waitForText(thankYouContent.header);
    await I.downloadPdfIfNotIE11('#checkAnswerHref');
    await I.downloadPdfIfNotIE11('#coverSheetPdfHref');
    await I.downloadPdfIfNotIE11('#declarationPdfHref');

    if (testSurvey) {
        const originalTabs = await I.grabNumberOfOpenTabs();
        await I.click({css: '#main-content > div > div > div.govuk-notification-banner > div > p.govuk-body > a'});
        for (let i = 0; i <= 5; i++) {
            // eslint-disable-next-line no-await-in-loop
            const currentTabs = await I.grabNumberOfOpenTabs();
            if (currentTabs > originalTabs) {
                break;
            }
            // eslint-disable-next-line no-await-in-loop
            await I.wait(0.2);
        }
        await I.switchToNextTab(1);
        // running locally I get no internet here so have commented ths, but at least we've proved we've opened a new tab.
        // await I.waitForVisible({css: '#cmdGo'});
        await I.closeCurrentTab();
        await I.wait(0.2);
    }

    const locator = {css: '#navigation > li:nth-child(2) > a'};
    await I.waitForElement(locator);
    await I.navByClick(locator);
};
