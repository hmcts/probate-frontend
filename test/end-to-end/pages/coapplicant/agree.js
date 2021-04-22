'use strict';

const config = require('config');
const agreeContentEn = require('app/resources/en/translation/coapplicant/agreepage');
const agreeContentCy = require('app/resources/cy/translation/coapplicant/agreepage');

module.exports = async function(language = 'en') {
    const I = this;
    const content = language === 'en' ? agreeContentEn : agreeContentCy;

    await I.checkPageUrl('app/steps/ui/coapplicant/agreepage');
    await I.waitForText(content.subHeader, config.TestWaitForTextToAppear);

    // if (elementId === 0) {
    //     I.see('When everyone');
    // } else {
    //     I.see('All executors applying');
    // }
};
