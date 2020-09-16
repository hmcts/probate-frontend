'use strict';

const commonContent = require('app/resources/en/translation/common');
const testConfig = require('test/config');

module.exports = function() {
    const I = this;
    I.wait(3);

    I.waitForText('What is your sex?', testConfig.TestWaitForTextToAppear);

    I.seeInCurrentUrl('sex');

    I.click('#sex-4');

    I.navByClick(commonContent.continue);
};
