'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(totalCodicils) {
    const I = this;

    await I.checkPageUrl('app/steps/ui/will/codicilsnumber');
    await I.fillField('#codicilsNumber', totalCodicils);

    await I.navByClick(commonContent.saveAndContinue);
};
