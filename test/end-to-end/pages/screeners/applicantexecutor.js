'use strict';

module.exports = async function(language ='en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const applicantExecutorContent = require(`app/resources/${language}/translation/screeners/applicantexecutor`);
    const {decodeHTML} = require('test/end-to-end/helpers/GeneralHelpers');

    await I.checkInUrl('/applicant-executor');
    await I.waitForText(await decodeHTML(applicantExecutorContent.question));
    await I.waitForText(await decodeHTML(applicantExecutorContent.hintText1));

    const locator = {css: `#executor${answer}`};
    await I.waitForEnabled(locator);
    await I.click(locator);
    await I.navByClick(commonContent.continue, 'button.govuk-button');
};
