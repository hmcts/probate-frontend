'use strict';
const contentEn = 'Payment summary';
const contentCy = 'Cadarnhau eich taliad';

module.exports = async function(language ='en') {
    const I = this;
    const commonContent = language === 'en' ? contentEn : contentCy;

    await I.waitForText(commonContent);
    const locator = {css: '#confirm'};
    await I.waitForClickable(locator);
    await I.navByClick(locator);
};
