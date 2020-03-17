'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/currentnamereason');

module.exports = (executorNumber, aliasReason, aliasOther) => {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl(parseInt(executorNumber)-1));
    I.click(`#${aliasReason}`);

    if (aliasOther) {
        I.fillField('#otherReason', aliasOther);
    }

    I.navByClick(commonContent.saveAndContinue);
};
