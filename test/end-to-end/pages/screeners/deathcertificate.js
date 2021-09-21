/* eslint-disable no-await-in-loop */
'use strict';

module.exports = async function(language ='en', testSurvey = false) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const deathCertContent = require(`app/resources/${language}/translation/screeners/deathcertificate`);

    await I.checkInUrl('/death-certificate');

    // if (I.dontSeeElement('button.govuk-button')) {
    //      await I.refreshPage();
    //      await I.checkInUrl('/death-certificate');
    //  }

    await I.waitForText(deathCertContent.question);
    const locator = {css: '#deathCertificate'};
    await I.waitForEnabled(locator);

    if (testSurvey) {
        const originalTabs = await I.grabNumberOfOpenTabs();
        await I.click({css: 'body > div.govuk-width-container > div > p > span > a:nth-child(1)'});
        for (let i = 0; i <= 5; i++) {
            const currentTabs = await I.grabNumberOfOpenTabs();
            if (currentTabs > originalTabs) {
                break;
            }
            await I.wait(0.2);
        }
        await I.switchToNextTab(1);
        // running locally I get no internet here so have commented ths, but at least we've proved we've opened a new tab.
        // await I.waitForVisible({css: '#cmdGo'});
        await I.closeCurrentTab();
    }
    await I.click(locator);
    await I.navByClick(commonContent.continue, 'button.govuk-button');
};
