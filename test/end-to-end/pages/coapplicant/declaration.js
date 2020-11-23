'use strict';

module.exports = async function(answer) {
    const I = this;

    const locator = {css: `#agreement${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);

    await I.navByClick('#acceptAndSend');
};
