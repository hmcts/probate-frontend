'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/notified');

module.exports = function(executorNotified, executorNumber) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl(parseInt(executorNumber)));

    if (executorNotified === 'Yes') {
        I.click('#executorNotified');
    } else {
        I.click('#executorNotified-2');
    }

    I.navByClick(commonContent.saveAndContinue);
};
