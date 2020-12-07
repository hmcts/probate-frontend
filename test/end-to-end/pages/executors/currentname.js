'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(executorNumber) {
    const I = this;

    await I.checkPageUrl('app/steps/ui/executors/currentname', '*');
    await I.fillField('#currentName', `Executor${executorNumber} Current Name`);
    await I.navByClick(commonContent.saveAndContinue);
};
