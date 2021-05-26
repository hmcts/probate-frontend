/* eslint-disable no-await-in-loop */
'use strict';

const taskListContentEn = require('app/resources/en/translation/tasklist');
const taskListContentCy = require('app/resources/cy/translation/tasklist');
const testConfig = require('config');

module.exports = async function(language ='en') {
    const I = this;
    const taskListContent = language === 'en' ? taskListContentEn : taskListContentCy;
    console.info('about to wait for intro text');
    await I.waitForText(taskListContent.introduction, testConfig.TestWaitForTextToAppear);
    console.info('about to check url');
    await I.checkPageUrl('app/steps/ui/tasklist');
    console.info('url checked');
    const locator = {css: '.govuk-button'};
    await I.waitForElement(locator);
    console.info('button locator found');
    await I.click(locator);
    console.info('button clicked');
};
