/* eslint-disable no-await-in-loop */
'use strict';

const content = require('app/resources/en/translation/dashboard');

module.exports = async function() {
    const I = this;

    await I.checkPageUrl('app/steps/ui/dashboard');
    await I.waitForText(content.header);

    // we do need to allow refreshing the page here as it takes time to populate ccd, and storing data in the ccd
    // database gives a success before is actually populated, so is async.
    for (let i = 0; i <= 5; i++) {
        const result = await I.checkForText('Continue application');
        if (result === true) {
            break;
        }
        await I.refreshPage();
        await I.wait(3);
    }

    await I.see(content.tableHeaderCcdCaseId);
    await I.see(content.tableHeaderDeceasedName);
    await I.see(content.tableHeaderCreateDate);
    await I.see(content.tableHeaderCaseStatus);

    await I.waitForElement({css: 'a[href="/start-eligibility"]'});
    await I.waitForText('Continue application');
    await I.navByClick('Continue application');
};
