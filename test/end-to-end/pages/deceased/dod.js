'use strict';

const config = require('config');
const commonContent = require('app/resources/en/translation/common');
const content = require('app/resources/en/translation/deceased/dod');

module.exports = async function(day, month, year) {
    const I = this;

    await I.waitForText(content.question, config.TestWaitForTextToAppear);
    const dodDayLocator = {css: '#dod-day'};
    await I.waitForElement(dodDayLocator);
    await I.fillField(dodDayLocator, day);
    await I.fillField({css: '#dod-month'}, month);
    await I.fillField({css: '#dod-year'}, year);

    await I.navByClick(commonContent.saveAndContinue);
};
