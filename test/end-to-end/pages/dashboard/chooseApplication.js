'use strict';

module.exports = async function() {
    const I = this;

    // we do need a wait here as it takes time to populate ccd, and storing data in the ccd database gives a success before is actually populated,
    // so is async. To be more scientific, and to allow to continue as soon as available, we could potentially poll, we have the caseid at this point.
    await I.wait(5);
    await I.waitForElement({css: 'a[href="/start-eligibility"]'});
    await I.waitForText('Continue application');
    await I.navByClick('Continue application');
};
