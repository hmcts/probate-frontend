'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/notified/index');

module.exports = function (executorNotified, executorNumber) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl(parseInt(executorNumber) - 1));

    if (executorNotified === 'Yes') {
        I.click('#executorNotified-optionYes');
    } else {
        I.click('#executorNotified-optionNo');
    }

    I.click(commonContent.saveAndContinue);
};
