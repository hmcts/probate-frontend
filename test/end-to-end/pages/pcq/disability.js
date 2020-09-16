'use strict';

const commonContent = require('app/resources/en/translation/common');
const testConfig = require('test/config');

module.exports = function() {
    const I = this;
    I.wait(3);

    I.waitForText('Do you have any physical or mental health conditions or illnesses lasting or expected to last 12 months or more?', testConfig.TestWaitForTextToAppear);

    I.seeInCurrentUrl('disability');

    I.click('#disability_conditions-4');

    I.navByClick(commonContent.continue);
};
