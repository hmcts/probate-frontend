'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/currentnamereason');

module.exports = async function(executorNumber, aliasOther) {
    const I = this;

    await I.seeCurrentUrlEquals(pageUnderTest.getUrl(parseInt(executorNumber)-3));
    await I.click('#currentNameReason-4');

    if (aliasOther) {
        await I.fillField('#otherReason', aliasOther);
    }

    await I.navByClick(commonContent.saveAndContinue);
};
