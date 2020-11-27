'use strict';

const config = require('config');
const commonContent = require('app/resources/en/translation/common');
const content = require('app/resources/en/translation/executors/number');

module.exports = async function (totalExecutors) {
    const I = this;

    await I.waitForText(content.checklist1Header, config.TestWaitForTextToAppear);
    const locator = {css: '#executorsNumber'};
    await I.waitForElement(locator);
    await I.fillField(locator, totalExecutors);

    await I.navByClick(commonContent.saveAndContinue);
};
