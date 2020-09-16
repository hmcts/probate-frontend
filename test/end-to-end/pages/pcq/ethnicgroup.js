'use strict';

const commonContent = require('app/resources/en/translation/common');
const testConfig = require('test/config');

module.exports = function() {
    const I = this;
    I.wait(3);

    I.waitForText('What is your ethnic group?', testConfig.TestWaitForTextToAppear);

    I.seeInCurrentUrl('ethnic-group');

    I.click('#ethnic_group-7');

    I.navByClick(commonContent.continue);
};
