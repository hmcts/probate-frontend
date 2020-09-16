'use strict';

const commonContent = require('app/resources/en/translation/common');
const testConfig = require('test/config');

module.exports = function() {
    const I = this;
    I.wait(3);

    I.waitForText('Are you pregnant or have you been pregnant in the last year?', testConfig.TestWaitForTextToAppear);

    I.seeInCurrentUrl('pregnant');

    I.click('#pregnancy-4');

    I.navByClick(commonContent.continue);
};
