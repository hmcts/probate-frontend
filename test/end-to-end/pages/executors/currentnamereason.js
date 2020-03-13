'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = function(executorNumber, aliasReason, aliasOther) {
    const I = this;

    I.click(`#${aliasReason}`);

    if (aliasOther) {
        I.fillField('#otherReason', aliasOther);
    }

    I.navByClick(commonContent.saveAndContinue);
};
