'use strict';

const commonContent = require('app/resources/en/translation/common');
const testConfig = require('test/config');

module.exports = function() {
    const I = this;
    I.wait(3);

    I.waitForText('Are you married or in a legally registered civil partnership?', testConfig.TestWaitForTextToAppear);

    I.seeInCurrentUrl('marital-status');

    I.click('#marriage-4');

    I.navByClick(commonContent.continue);
};
