'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(firstName, lastName) {
    const I = this;

    await I.checkPageUrl('app/steps/ui/deceased/name');
    const firstNameLocator = {css: '#firstName'};
    await I.waitForElement(firstNameLocator);
    await I.fillField(firstNameLocator, firstName);
    await I.fillField({css: '#lastName'}, lastName);

    await I.navByClick(commonContent.saveAndContinue);
};
