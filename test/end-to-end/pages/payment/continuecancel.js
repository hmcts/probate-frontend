
'use strict';
const contentEn = 'Your payment has been cancelled';
const contentCy = 'Mae eich taliad wedi ei ganslo';

module.exports = async function(language ='en') {
    const I = this;
    const commonContent = language === 'en' ? contentEn : contentCy;
    await I.waitForText(commonContent);
    const locator = {css: '#return-url'};
    await I.waitForElement(locator);
    await I.navByClick(locator);
};
