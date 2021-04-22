'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');

module.exports = async function(language ='en') {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    await I.wait(3);
    await I.waitForText(commonContent.saveAndContinue);
    await I.navByClick(commonContent.saveAndContinue);
};
