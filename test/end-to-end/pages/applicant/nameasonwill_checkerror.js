'use strict';

module.exports = async function({applicantName, hasCodicils, language = 'en'} = {}) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const pageStrings = require(`app/resources/${language}/translation/applicant/nameasonwill`);

    const expectedQuestionUnsubs = hasCodicils ? pageStrings.questionWithCodicil : pageStrings.question;
    const expectedQuestion = expectedQuestionUnsubs.replace('{applicantName}', applicantName);

    await I.checkInUrl('/applicant-name-as-on-will');
    const locator = {css: '#nameAsOnTheWill'};

    await I.waitForEnabled(locator);
    await I.waitForText(expectedQuestion);
    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');

    await I.waitForEnabled(locator);
    await I.waitForText(expectedQuestion);

    // should we check the actual error text here?
};
