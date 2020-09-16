'use strict';

const commonContent = require('app/resources/en/translation/common');
const testConfig = require('test/config');

module.exports = function() {
    const I = this;
    I.wait(3);

    I.waitForText('Which of the following best describes how you think of yourself?', testConfig.TestWaitForTextToAppear);

    I.seeInCurrentUrl('sexual-orientation');

    I.click('#sexuality-6');

    I.navByClick(commonContent.continue);
};
