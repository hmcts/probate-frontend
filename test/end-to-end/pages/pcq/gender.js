'use strict';

const commonContent = require('app/resources/en/translation/common');
const testConfig = require('test/config');

module.exports = function() {
    const I = this;
    I.wait(3);

    I.waitForText('Is your gender the same as the sex you were registered at birth?', testConfig.TestWaitForTextToAppear);

    I.seeInCurrentUrl('gender-same-as-sex');

    I.click('#gender_different-4');

    I.navByClick(commonContent.continue);
};
