'use strict';

module.exports = async function(answer) {
    const I = this;

    await I.checkPageUrl('app/steps/ui/coapplicant/declaration');
    const locator = {css: `#agreement${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);

    await I.navByClick('#acceptAndSend');
};
