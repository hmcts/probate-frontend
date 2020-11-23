'use strict';


module.exports = async function() {
    const I = this;

    await I.waitForText('Payment summary');
    const locator = {css: '#confirm'};
    await I.waitForElement(locator);

    await I.navByClick(locator);
};
