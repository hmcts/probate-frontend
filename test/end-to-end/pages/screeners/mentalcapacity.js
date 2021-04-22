'use strict';

const contentEn = require('app/resources/en/translation/common');
const contentCy = require('app/resources/cy/translation/common');
const mentalCapacityEn = require('app/resources/en/translation/screeners/mentalcapacity');
const mentalCapacityCy = require('app/resources/cy/translation/screeners/mentalcapacity');

module.exports = async function(language ='en', answer) {
    const I = this;
    const commonContent = language === 'en' ? contentEn : contentCy;
    const mentalCapacityContent = language === 'en' ? mentalCapacityEn : mentalCapacityCy;

    await I.checkPageUrl('app/steps/ui/screeners/mentalcapacity');
    await I.waitForText(mentalCapacityContent.question);
    await I.waitForText(mentalCapacityContent.hintText1);

    const locator = {css: `#mentalCapacity${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);
    await I.navByClick(commonContent.continue);
};
