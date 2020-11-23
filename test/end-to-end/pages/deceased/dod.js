'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(day, month, year) {
    const I = this;

    const dodDayLocator = {css: '#dod-day'};
    await I.waitForElement(dodDayLocator);
    await I.fillField(dodDayLocator, day);
    await I.fillField({css: '#dod-month'}, month);
    await I.fillField({css: '#dod-year'}, year);

    await I.navByClick(commonContent.saveAndContinue);
};
