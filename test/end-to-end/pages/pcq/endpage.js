'use strict';

const testConfig = require('test/config');

module.exports = function() {
    const I = this;
    I.wait(3);

    I.waitForText('You have answered the equality questions', testConfig.TestWaitForTextToAppear);

    I.seeInCurrentUrl('end-page');

    I.navByClick('Continue to the next steps');
};
