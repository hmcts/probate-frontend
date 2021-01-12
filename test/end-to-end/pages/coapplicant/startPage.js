'use strict';

const config = require('config');
const content = require('app/resources/en/translation/coapplicant/startpage');

module.exports = async function() {
    const I = this;

    await I.checkPageUrl('app/steps/ui/coapplicant/startpage');
    await I.waitForText(content.subHeader1, config.TestWaitForTextToAppear);
    await I.navByClick('.govuk-button');
};
