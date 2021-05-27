'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(alias) {
    const I = this;

    await I.checkInUrl('/applicant-alias');
    await I.fillField('#alias', alias);

    await I.navByClick(commonContent.saveAndContinue);
};
