'use strict';

const commonContent = require('app/resources/en/translation/common');
const content = require('app/resources/en/translation/applicant/phone');

module.exports = async function() {
    const I = this;
    await I.waitForText(content.phoneNumber);
    await I.fillField(content.phoneNumber, '123456789');

    await I.navByClick(commonContent.saveAndContinue);
};
