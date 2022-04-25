'use strict';

const config = require('config');

module.exports = async function(language ='en', firstname = null, lastname = null) {
    const I = this;

    const commonContent = require(`app/resources/${language}/translation/common`);
    const nameContent = require(`app/resources/${language}/translation/applicant/name`);

    await I.checkInUrl('/applicant-name');
    await I.waitForText(nameContent.question, config.TestWaitForTextToAppear);
    const locatorFn = {css: '#firstName'};
    await I.waitForEnabled(locatorFn);
    await I.fillField(locatorFn, firstname);
    await I.fillField({css: '#lastName'}, lastname);
    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
