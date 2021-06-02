'use strict';

const config = require('config');

module.exports = async function(language = 'en') {
    const I = this;
    const content = require(`app/resources/${language}/translation/coapplicant/startpage`);
    await I.checkInUrl('/co-applicant-start-page');
    await I.waitForText(content.subHeader1, config.TestWaitForTextToAppear);
    await I.navByClick({css: '.govuk-button'});
};
