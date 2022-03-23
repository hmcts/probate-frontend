'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(executorNumber, aliasOther) {
    const I = this;

    // this should be refactored to not need to load the application object
    await I.checkInUrl(`/executor-current-name-reason/${parseInt(executorNumber)-3}`);
    await I.waitForEnabled('#currentNameReason-4');
    await I.click('#currentNameReason-4');

    if (aliasOther) {
        await I.fillField('#otherReason', aliasOther);
    }

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
