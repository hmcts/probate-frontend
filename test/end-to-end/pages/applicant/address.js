'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function() {
    const I = this;

    await I.enterAddress();
    await I.navByClick(commonContent.saveAndContinue);
};
