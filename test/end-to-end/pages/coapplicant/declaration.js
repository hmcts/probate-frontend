'use strict';

module.exports = async function(answer) {
    const I = this;

    await I.checkInUrl('/co-applicant-declaration');
    const locator = {css: `#agreement${answer}`};
    await I.waitForEnabled(locator);
    await I.click(locator);

    await I.navByClick({css: '#acceptAndSend'});
};
