'use strict';

const testConfig = require('test/config');

module.exports = function() {
    const I = this;
    I.wait(3);

    I.waitForText('Equality and diversity questions', testConfig.TestWaitForTextToAppear);

    I.navByClick('#back-button');
};

function completePCQ () {
    const I = this;
    I.wait(3);
    I.click('.govuk-button.govuk-button--secondary');
}

module.exports = {
    completePCQ,
};
