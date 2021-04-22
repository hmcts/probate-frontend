'use strict';
const contentEn = 'Payment summary';
const contentCy = 'Cadarnhau eich taliad';
const locator = {css: '#cancel-payment'};

module.exports = async function(language ='en') {
    const I = this;
    const commonContent = language === 'en' ? contentEn : contentCy;
    await I.waitForText(commonContent);
    await I.waitForElement(locator);
    await I.navByClick(locator);
};
