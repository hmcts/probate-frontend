'use strict';

module.exports = async function(language ='en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const applicantExecutorContent = require(`app/resources/${language}/translation/screeners/applicantexecutor`);

    await I.checkInUrl('/applicant-executor');
    await I.waitForText(applicantExecutorContent.question);
    await I.waitForText(applicantExecutorContent.hintText1);
    await I.waitForText(applicantExecutorContent.hintText2);

    const locator = {css: `#executor${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);
    await I.navByClick(commonContent.continue, 'button.govuk-button');
};
