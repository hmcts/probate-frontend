'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/notified');

module.exports = function(executorNotified, executorNumber) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl(executorNumber));

    I.click(`#executorNotified${executorNotified}`);

    I.navByClick(commonContent.saveAndContinue);
};
