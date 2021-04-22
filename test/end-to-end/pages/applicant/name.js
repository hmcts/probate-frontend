'use strict';

const config = require('config');
const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const nameContentEn = require('app/resources/en/translation/applicant/name');
const nameContentCy = require('app/resources/cy/translation/applicant/name');

module.exports = async function(language ='en', firstname, lastname) {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const nameContent = language === 'en' ? nameContentEn : nameContentCy;

    await I.checkPageUrl('app/steps/ui/applicant/name');
    await I.waitForText(nameContent.question, config.TestWaitForTextToAppear);
    const locatorFn = {css: '#firstName'};
    await I.waitForElement(locatorFn);
    await I.fillField(locatorFn, firstname);
    await I.fillField({css: '#lastName'}, lastname);
    await I.navByClick(commonContent.saveAndContinue);
};
