'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(executorNumber) {
    const I = this;

    await I.checkInUrl('/executor-current-name/*');
    await I.waitForEnabled('#currentName');
    await I.fillField('#currentName', `Executor${executorNumber} Current Name`);
    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
