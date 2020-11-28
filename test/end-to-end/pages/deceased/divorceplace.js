'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(answer) {
    const I = this;
    await I.checkPageUrl('app/steps/ui/deceased/divorceplace');
    await I.click(`#divorcePlace ${answer}`);

    await I.navByClick(commonContent.saveAndContinue);
};
