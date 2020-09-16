'use strict';

const commonContent = require('app/resources/en/translation/common');
const testConfig = require('test/config');

module.exports = function() {
    const I = this;
    I.wait(3);

    I.waitForText('What is your religion?', testConfig.TestWaitForTextToAppear);

    I.seeInCurrentUrl('religion');

    I.click('#religion-10');

    I.navByClick(commonContent.continue);
};
