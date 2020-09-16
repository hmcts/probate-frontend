'use strict';

const commonContent = require('app/resources/en/translation/common');
const testConfig = require('test/config');

module.exports = function() {
    const I = this;
    I.wait(3);

    I.waitForText('What is your date of birth?', testConfig.TestWaitForTextToAppear);

    I.seeInCurrentUrl('date-of-birth');

    I.click('#dob_provided-3');

    I.navByClick(commonContent.continue);
};
