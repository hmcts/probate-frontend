'use strict';

const config = require('config');
const content = require('app/resources/en/translation/coapplicant/agreepage');

module.exports = async function() {
    const I = this;

    await I.checkPageUrl('app/steps/ui/coapplicant/agreepage');
    await I.waitForText(content.subHeader, config.TestWaitForTextToAppear);

    // if (elementId === 0) {
    //     I.see('When everyone');
    // } else {
    //     I.see('All executors applying');
    // }
};
