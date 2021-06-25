/* eslint-disable no-await-in-loop */
'use strict';

const testConfig = require('config');

module.exports = async function(language ='en') {
    const I = this;
    const dashboardContent = require(`app/resources/${language}/translation/dashboard`);

    // this implicit wait is just for ES to refresh so the application is ready and usable by UI!
    await I.wait(3);

    await I.checkInUrl('/dashboard');
    await I.waitForElement('#main-content', testConfig.TestWaitForTextToAppear);
    const welshLinkText = await I.grabTextFrom('//a[@class =\'govuk-link language\']');
    console.log('Dash Board Link Name::-->' + welshLinkText);

    // we do need to allow refreshing the page here as it takes time to populate ccd, and storing data in the ccd
    // database gives a success before is actually populated, so is async.
    if (language === 'en') {
        for (let i = 0; i <= 5; i++) {
            await I.waitForText(dashboardContent.header, testConfig.TestWaitForTextToAppear);
            const result = await I.checkForText(dashboardContent.actionContinue, 10);
            if (result === true) {
                break;
            }
            await I.refreshPage();
        }

        await I.see(dashboardContent.tableHeaderCcdCaseId);
        await I.see(dashboardContent.tableHeaderDeceasedName);
        await I.see(dashboardContent.tableHeaderCreateDate);
        await I.see(dashboardContent.tableHeaderCaseStatus);
        await I.navByClick(dashboardContent.actionContinue);
    } else {
        await I.amOnLoadedPage('/dashboard', language);
        await I.saveScreenshot('dashboard-before.png');

        for (let i = 0; i <= 5; i++) {
            await I.waitForElement('#main-content', testConfig.TestWaitForTextToAppear);
            const result = await I.checkForText(dashboardContent.actionContinue, 10);
            if (result === true) {
                break;
            }
            await I.amOnPage('/dashboard?lng=cy');
            await I.refreshPage();
        }
        await I.navByClick(dashboardContent.actionContinue);
        await I.wait(2);
    }
};
