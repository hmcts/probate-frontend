'use strict';

const content = require('app/resources/en/translation/dashboard');

module.exports = async function() {
    const I = this;

    await I.checkPageUrl('app/steps/ui/dashboard');
    // we do need a wait here as it takes time to populate ccd, and storing data in the ccd database gives a success before is actually populated,
    // so is async. To be more scientific, and to allow to continue as soon as available, we could potentially poll, we have the caseid at this point.
    await I.wait(5);
    await I.waitForText(content.header);
    await I.see(content.tableHeaderCcdCaseId);
    await I.see(content.tableHeaderDeceasedName);
    await I.see(content.tableHeaderCreateDate);
    await I.see(content.tableHeaderCaseStatus);

    await I.waitForElement({css: 'a[href="/start-eligibility"]'});
    await I.waitForText('Continue application');
    await I.navByClick('Continue application');
};
