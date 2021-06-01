/* eslint-disable no-await-in-loop */
'use strict';

const testConfig = require('config');

module.exports = async function(language ='en') {
    const I = this;
    const taskListContent = require(`app/resources/${language}/translation/tasklist`);
    await I.waitForText(taskListContent.introduction, testConfig.TestWaitForTextToAppear);
    await I.checkInUrl('/task-list');
    const locator = {css: '.govuk-button'};
    await I.waitForEnabled(locator);
    await I.scrollTo(locator);
    await I.click(locator);
};
