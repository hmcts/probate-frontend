'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/currentnamereason');

module.exports = function(executorNumber, aliasOther) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl(parseInt(executorNumber)-3));
    I.click('#currentNameReason-4');

    if (aliasOther) {
        I.fillField('#otherReason', aliasOther);
    }

    I.navByClick(commonContent.saveAndContinue);
};
