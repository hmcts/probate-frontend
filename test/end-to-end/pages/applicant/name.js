'use strict';

const config = require('config');
const commonContent = require('app/resources/en/translation/common');
const content = require('app/resources/en/translation/applicant/name');

module.exports = async function(firstname, lastname) {
    const I = this;

    await I.checkPageUrl('app/steps/ui/applicant/name');
    await I.waitForText(content.question, config.TestWaitForTextToAppear);
    const locatorFn = {css: '#firstName'};
    await I.fillField(locatorFn, firstname);
    await I.fillField({css: '#lastName'}, lastname);

    await I.navByClick(commonContent.saveAndContinue);
};
