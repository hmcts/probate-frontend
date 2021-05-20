/* eslint-disable no-await-in-loop */
'use strict';

const taskListContentEn = require('app/resources/en/translation/tasklist');
const taskListContentCy = require('app/resources/cy/translation/tasklist');
const testConfig = require('config');

module.exports = async function(language ='en') {
    const I = this;
    const taskListContent = language === 'en' ? taskListContentEn : taskListContentCy;
    await I.checkPageUrl('app/steps/ui/tasklist');
    await I.waitForText(taskListContent.introduction, testConfig.TestWaitForTextToAppear);
    const locator = {css: '.govuk-button'};
    await I.waitForElement(locator);
    await I.navByClick(locator);
};
