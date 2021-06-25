/* eslint-disable no-await-in-loop */
'use strict';

const testConfig = require('config');

module.exports = async function(language ='en') {
    const I = this;
    const taskListContent = require(`app/resources/${language}/translation/tasklist`);
    await I.waitForText(taskListContent.introduction, testConfig.TestWaitForTextToAppear);
    await I.checkInUrl('/task-list');
    await I.navByClick({css: '.govuk-button'});
};
