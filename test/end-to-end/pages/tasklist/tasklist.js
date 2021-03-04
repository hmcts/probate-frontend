/* eslint-disable no-await-in-loop */
'use strict';

const taskListContentEn = require('app/resources/en/translation/tasklist');
const taskListContentCy = require('app/resources/cy/translation/tasklist');
const testConfig = require('config');

module.exports = async function(language ='en') {
    const I = this;
    const taskListContent = language === 'en' ? taskListContentEn : taskListContentCy;
    if (language === 'en' && language === 'cy') {
        await I.waitForText(taskListContent.introduction, testConfig.TestWaitForTextToAppear);
    }
    await I.checkPageUrl('app/steps/ui/tasklist');
    const locator = {css: '.govuk-button'};
    let elementExisted = false;
    do {
        try {
            await I.waitForElement(locator);
            elementExisted = true;
        } catch (e) {
            await I.refreshPage();
        }
    } while (elementExisted === false);
    await I.retry(3).click(locator);
};
