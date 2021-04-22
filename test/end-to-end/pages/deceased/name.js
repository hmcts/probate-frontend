'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');

module.exports = async function(language ='en', firstName, lastName) {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;

    await I.checkPageUrl('app/steps/ui/deceased/name');
    const firstNameLocator = {css: '#firstName'};
    await I.waitForElement(firstNameLocator);
    await I.fillField(firstNameLocator, firstName);
    await I.fillField({css: '#lastName'}, lastName);

    await I.navByClick(commonContent.saveAndContinue);
};
