'use strict';

const config = require('config');
const startContentEn = require('app/resources/en/translation/coapplicant/startpage');
const startContentCy = require('app/resources/cy/translation/coapplicant/startpage');

module.exports = async function(language = 'en') {
    const I = this;
    const content = language === 'en' ? startContentEn : startContentCy;

    await I.checkPageUrl('app/steps/ui/coapplicant/startpage');
    await I.waitForText(content.subHeader1, config.TestWaitForTextToAppear);
    await I.navByClick('.govuk-button');
};
