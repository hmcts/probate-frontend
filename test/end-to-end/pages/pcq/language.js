'use strict';

const commonContent = require('app/resources/en/translation/common');
const testConfig = require('test/config');

module.exports = function() {
    const I = this;
    I.wait(3);

    I.waitForText('What is your main language?', testConfig.TestWaitForTextToAppear);

    I.seeInCurrentUrl('language');

    I.click('#language_main-4');

    I.navByClick(commonContent.continue);
};
