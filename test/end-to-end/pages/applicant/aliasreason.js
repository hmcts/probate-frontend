'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(aliasReason, aliasOther) {
    const I = this;

    await I.checkInUrl('/applicant-alias-reason');
    await I.click(`#aliasReason${aliasReason}`);

    if (aliasReason === '-4') {
        await I.fillField('#otherReason', aliasOther);
    }

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
