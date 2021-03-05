/* eslint-disable no-await-in-loop */
'use strict';

const taskListContentEn = require('app/resources/en/translation/tasklist');
const taskListContentCy = require('app/resources/cy/translation/tasklist');
const testConfig = require('config');

module.exports = async function(language ='en') {
    const I = this;
    const taskListContent = language === 'en' ? taskListContentEn : taskListContentCy;
    if (taskListContent && (language === 'en' || language === 'cy')) {
        await I.waitForText(taskListContent.introduction, testConfig.TestWaitForTextToAppear);
    }
    await I.checkPageUrl('app/steps/ui/tasklist');

    for (let i = 0; i <= 2; i++) {
        await I.waitForText(taskListContent.header, testConfig.TestWaitForTextToAppear);
        const result = await I.checkForText(taskListContent.taskStarted, 10);
        if (result === true) {
            break;
        }
        await I.refreshPage();
    }

    const locator = {css: '.govuk-button'};
    await I.waitForElement(locator);
    await I.click(locator);
};
